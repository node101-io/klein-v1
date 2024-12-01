"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Sidebar from "@/components/second-sidebar";
import NodeOperations from "@/components/operations/overview/node-overview";
import { fetchProjectById } from "@/services/api";
import EditValidator from "@/components/operations/node-edit/edit-validator";
import { Project } from "@/types/projects.types";

const NodeOverviewPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("Node Operations");
  const [node, setNode] = useState<Project | null>(null);
  const [hasUpdate, setHasUpdate] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      const getProjectData = async () => {
        try {
          const projectData = await fetchProjectById(id);
          setNode(projectData);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };

      getProjectData();
    }
  }, [id]);

  if (!id) {
    return <div>No ID provided in query parameters.</div>;
  }

  if (!node) {
    return <div>Loading...</div>;
  }

  const handleSelectItem = (item: string): void => {
    setSelectedItem(item);
  };

  const handleNodeOperation = (operation: string): void => {
    alert(`${operation}`);
  };

  return (
    <div className="flex flex-row w-full h-full gap-x-4">
      <Sidebar
        node={node}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
        hasUpdate={hasUpdate}
        onNodeOperation={handleNodeOperation}
      />
      <div className="p-14 flex-1 bg-gray rounded-xl overflow-hidden">
        {selectedItem === "Node Operations" && <NodeOperations />}
        {selectedItem === "Edit Validator" && <EditValidator />}
      </div>
    </div>
  );
};

export default NodeOverviewPage;
