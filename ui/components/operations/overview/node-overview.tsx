"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import HelpIcon from "@/assets/icons/help.svg";
import Tooltip from "@/components/common/Tooltip";
import OverviewCard from "./overview-card";

const NodeOperations = () => {
  const [currentBlock, setCurrentBlock] = useState(21316236);
  const [failedBlocks, setFailedBlocks] = useState<number[]>([]);
  const [memory, setMemory] = useState(90);
  const [cpu, setCpu] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => {
        const next = prev + 1;
        if (Math.random() < 0.2) {
          setFailedBlocks((failed) => [...failed, next]);
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const memoryInterval = setInterval(() => {
      setMemory(Math.random() * 10 + 90);
    }, 5000);

    const cpuInterval = setInterval(() => {
      setCpu(Math.random() * 100);
    }, 5000);

    return () => {
      clearInterval(memoryInterval);
      clearInterval(cpuInterval);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light">Node Overview</h1>
        <Tooltip content="Click here to learn about Aleo">
          <a
            href="https://node101.io"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit h-fit"
          >
            <Image
              src={HelpIcon}
              alt="Help Icon"
              width={20}
              height={20}
            />
          </a>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <OverviewCard
          title="Sync Status"
          value={`${(currentBlock / 9000000).toFixed(2)}k`}
          info="Current synchronization status of the node"
          color="purple"
          type="sync"
          currentBlock={currentBlock}
          failedBlocks={failedBlocks}
          details={[
            `Current Block ${currentBlock.toLocaleString()}`,
            `Latest Block  ${(currentBlock - 1).toLocaleString()}`,
          ]}
        />

        <OverviewCard
          title="CPU"
          value={cpu.toFixed(2) + "%"}
          info="Current CPU usage of the node"
          color="blue"
          details={[]}
        />

        <OverviewCard
          title="Memory"
          value={memory.toFixed(2) + "%"}
          info="Current memory usage of the node"
          color="red"
          details={[]}
        />
      </div>
    </div>
  );
};

export default NodeOperations;
