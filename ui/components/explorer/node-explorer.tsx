"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SearchIcon from "@/assets/icons/search.svg";

import NodeCard from "@/components/common/node-card";
import { fetchProjects } from "@/services/api";
import { TransformedProject } from "@/types/projects.types";

const NodeExplorer: React.FC = () => {
  const [nodes, setNodes] = useState<TransformedProject[]>([]);
  const [network, setNetwork] = useState<"all" | "mainnet" | "testnet">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNodes = async () => {
      try {
        const transformedNodes = await fetchProjects();
        setNodes(transformedNodes);
      } catch (error) {
        setError("Failed to load nodes. Please try again later.");
      }
    };

    getNodes();
  }, []);

  const networkFilteredNodes = nodes.filter(
    (node) => network === "all" || node.network === network
  );

  const searchResults = networkFilteredNodes.filter((node) =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text: string): JSX.Element => {
    if (!searchTerm) return <>{text}</>;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span
              key={i}
              className="text-blue_klein"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="mb-6 relative w-full max-w-[657px] flex justify-center">
          <div className="relative w-full max-w-[657px]">
            <Image
              src={SearchIcon}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            />
            <input
              type="search"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rounded-[16px] pr-4 py-2  
                bg-white text-gray-900 
                placeholder-gray-500
                focus:outline-none focus:ring-0 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-x-2 mb-6 flex justify-center">
          {["all", "mainnet", "testnet"].map((net) => (
            <button
              key={net}
              onClick={() => setNetwork(net as "all" | "mainnet" | "testnet")}
              className={`px-4 py-2 bg-white text-[12px] rounded-[12px] transition-colors ${
                network === net
                  ? "border-[1px] border-black text-black"
                  : "text-gray-700 hover:bg-gray dark:bg-bg_dark_gray"
              }`}
            >
              {net.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {searchTerm && (
        <div className="flex flex-wrap gap-6">
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid gap-6 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-2">
              {searchResults.length > 0 ? (
                searchResults.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    highlightText={highlightText}
                  />
                ))
              ) : (
                <p className="text-gray-500">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>
        <div className="grid gap-6 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-2">
          {networkFilteredNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              highlightText={highlightText}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NodeExplorer;
