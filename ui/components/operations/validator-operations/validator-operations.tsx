import React, { useState } from "react";
import Image from "next/image";
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
        <div className="">
          <nav
            className="-mb-px flex"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("create")}
              className={`w-1/4 py-4 px-1 text-center font-medium text-sm ${
                activeTab === "create"
                  ? "border-b-[1px] border-b-blue_klein text-black"
                  : "text-gray-700 hover:bg-gray dark:bg-bg_dark_gray"
              }`}
            >
              Create Validator
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`w-1/4 py-4 px-1 text-center font-medium text-sm ${
                activeTab === "edit"
                  ? "border-b-[1px] border-b-blue_klein text-black"
                  : "text-gray-700 hover:bg-gray dark:bg-bg_dark_gray"
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
