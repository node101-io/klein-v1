import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/input";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";
import HelpIcon from "@/assets/icons/help.svg";
import CreateValidator from "./create-validator";
import EditValidator from "./edit-validator";

const ValidatorOperations = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light text-[#525252]">
          Validator Operations
        </h1>
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

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("create")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create Validator
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "edit"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit Validator
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "create" ? <CreateValidator /> : <EditValidator />}
    </div>
  );
};

export default ValidatorOperations;
