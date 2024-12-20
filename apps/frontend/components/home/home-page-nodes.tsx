"use client";
import React, { useState } from "react";

import { TransformedProject } from "@/types/projects.types";
import NodeCard from "../common/node-card";

interface NodeExplorerProps {
  nodes?: TransformedProject[];
}

const HomeNodesPage: React.FC<NodeExplorerProps> = ({ nodes = [] }) => {
  const [network, setNetwork] = useState<"all" | "mainnet" | "testnet">("all");

  const filteredNodes = nodes.filter((node) => {
    const matchesNetwork = network === "all" || node.network === network;
    return matchesNetwork;
  });

  return (
    <>
      <div className="space-x-2 mb-6">
        {["all", "mainnet", "testnet"].map((net) => (
          <button
            key={net}
            onClick={() => setNetwork(net as "all" | "mainnet" | "testnet")}
            className={`px-4 py-2 pr-12 transition-colors ${
              network === net
                ? "border-b-[1px] border-b-blue_klein text-black"
                : "text-gray-700 hover:bg-gray dark:bg-bg_dark_gray"
            }`}
          >
            {net.charAt(0).toUpperCase() + net.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-2">
        {filteredNodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
          />
        ))}
      </div>
    </>
  );
};

export default HomeNodesPage;
