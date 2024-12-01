"use client";

import React, { useState } from "react";
import Image from "next/image";

import styles from "@/assets/icons/update/animated-rocket-icon.module.css";
import ValidatorOperationsIcon from "@/assets/icons/validator-operations.svg";
import NodeIcon from "@/assets/icons/node.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";
import UpdateIcon from "@/assets/icons/update.svg";
import StopIcon from "@/assets/icons/stop.svg";
import RestartIcon from "@/assets/icons/restart.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import AnimatedRocketIcon from "@/assets/icons/update/animated-rocket";
import { useSidebar } from "@/contexts/sidebar-context";
import { Project } from "@/types/projects.types";

interface NodeSidebarProps {
  node: Project;
  selectedItem: string;
  onSelectItem: (item: string) => void;
  onNodeOperation: (operation: string) => void;
  hasUpdate: boolean;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({
  node,
  selectedItem,
  onSelectItem,
  onNodeOperation,
}) => {
  const [validatorCollapsed, setValidatorCollapsed] = useState<boolean>(false);

  const toggleValidatorCollapse = () => {
    setValidatorCollapsed(!validatorCollapsed);
  };

  const { hasUpdate } = useSidebar();

  const nodeOperations = [
    { name: "Update", icon: UpdateIcon, show: hasUpdate },
    { name: "Stop Node", icon: StopIcon, show: true },
    { name: "Restart Node", icon: RestartIcon, show: true },
    { name: "Delete Node", icon: DeleteIcon, show: true },
  ];

  const validatorOperations: string[] = [
    "Wallet Operations",
    "Edit Validator",
    "Withdraw Rewards",
    "Staking Operations",
    "Vote",
    "Send Token",
    "Logs",
  ];

  return (
    <div className="h-full w-[260px] bg-gray dark:bg-bg_dark_gray rounded-xl">
      <div className="h-full flex flex-col">
        <div className="flex items-start mb-4 justify-between p-4">
          <div className="flex items-center">
            <Image
              src={node.image[1].url}
              alt={node.name}
              width={80}
              height={80}
              className="rounded-xl shadow-md mr-4"
            />
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {node.name}
                </h3>
              </div>
              <p className="text-sm mt-1 text-text_gray">
                {node.chain_registry_identifier}
              </p>
            </div>
          </div>
        </div>

        {/* Node Operations */}
        <div className="w-full px-4 mt-4">
          <button
            onClick={() => onSelectItem("Node Operations")}
            className={`flex items-center w-full text-left text-xs font-medium uppercase text-text_gray mb-2 focus:outline-none hover:bg-hover_gray rounded-lg py-2`}
          >
            <Image
              src={NodeIcon}
              alt="Node Operations"
              width={20}
              height={20}
              className="mr-2 ml-2"
            />
            <span>Node Overview</span>
          </button>
          <nav className="flex flex-col space-y-1 mt-2">
            {nodeOperations.map(
              (item, index) =>
                item.show && (
                  <button
                    key={index}
                    onClick={() => onNodeOperation(item.name)}
                    className={`${styles.button} flex w-full text-left py-2 hover:bg-hover_gray rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out`}
                  >
                    {item.name === "Update" ? (
                      <div className={`mr-2 ml-2`}>
                        <AnimatedRocketIcon />
                      </div>
                    ) : (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={16}
                        height={16}
                        className="mr-2 ml-2"
                      />
                    )}
                    <span
                      className={`text-base font-normal leading-[20px] tracking-[-0.32px] text-text_gray`}
                    >
                      {item.name}
                    </span>
                  </button>
                )
            )}
          </nav>
        </div>

        {/* Validator Operations */}
        <div className="w-full px-4 mt-4">
          <button
            onClick={toggleValidatorCollapse}
            className="flex items-center w-full text-left text-xs font-medium uppercase text-text_gray mb-2 focus:outline-none ml-2"
          >
            <Image
              src={ValidatorOperationsIcon}
              alt="Validator Operations"
              width={20}
              height={20}
              className="mr-2"
            />
            <span>Validator Operations</span>
            <Image
              src={ChevronIcon}
              alt="Toggle"
              width={16}
              height={16}
              className={`ml-auto transform transition-transform duration-300 ${
                validatorCollapsed ? "-rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              validatorCollapsed ? "max-h-0" : "max-h-[1000px]"
            }`}
          >
            <nav className="flex flex-col space-y-1 mt-2">
              {validatorOperations.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelectItem(item)}
                  className={`block w-full text-left hover:bg-hover_gray rounded-lg overflow-hidden ${
                    selectedItem === item ? "bg-selected_bg" : ""
                  } transform transition-all duration-300 ease-in-out`}
                >
                  <div className="flex items-center px-4 py-2">
                    <span
                      className={`text-base font-normal leading-[20px] tracking-[-0.32px] ${
                        selectedItem === item ? "font-bold" : "text-text_gray"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeSidebar;
