"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { fetchProjectById } from "@/services/api";
import { Project } from "@/types/projects.types";

import Sidebar from "@/components/second-sidebar";
import NodeOperations from "@/components/operations/overview/node-overview";
import ValidatorOperation from "@/components/operations/validator-operations/validator-operations";
import WalletOperations from "@/components/operations/wallet-operation/wallet-operation";
import StakingOperations from "@/components/operations/staking-operations/staking-operations";
import WithdrawRewards from "@/components/operations/withdraw-rewards/withdraw-rewards";
import VoteOperation from "@/components/operations/vote/vote-operation";

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
      <div className="p-14 flex-1 bg-gray rounded-xl overflow-auto">
        {selectedItem === "Node Operations" && <NodeOperations />}
        {selectedItem === "Validator Operations" && <ValidatorOperation />}
        {selectedItem === "Wallet Operations" && <WalletOperations />}
        {selectedItem === "Staking Operations" && <StakingOperations />}
        {selectedItem === "Withdraw Rewards" && <WithdrawRewards />}
        {selectedItem === "Vote" && <VoteOperation />}
      </div>
    </div>
  );
};

export default NodeOverviewPage;
