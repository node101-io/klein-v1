import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/input";
import HelpIcon from "@/assets/icons/help.svg";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";

interface VoteFormData {
  fees: string;
  keyName: string;
  ProposalID: string;
  toAddress: string;
}

const VoteOperatoin = () => {
  const [voteForm, setVoteForm] = useState<VoteFormData>({
    ProposalID: "",
    fees: "",
    keyName: "",
    toAddress: "",
  });

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVoteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vote form submitted:", voteForm);
  };

  return (
    <div className="flex flex-col w-full h-full mb-8">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light text-[#525252]">
          Vote Operations
        </h1>
        <Tooltip content="Click here to learn about Vote">
          <Image
            src={HelpIcon}
            alt="Help Icon"
            width={20}
            height={20}
          />
        </Tooltip>
      </div>

      <div className="mb-12">
        <form
          onSubmit={handleVoteSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fees"
              name="fees"
              value={voteForm.fees}
              onChange={handleVoteChange}
            />
            <Input
              label="Key Name"
              name="keyName"
              value={voteForm.keyName}
              onChange={handleVoteChange}
            />
            <Input
              label="Proposal ID"
              name="ProposalID"
              value={voteForm.ProposalID}
              onChange={handleVoteChange}
            />
            <Input
              label="Proposal ID"
              name="Proposal ID"
              value={voteForm.toAddress}
              onChange={handleVoteChange}
            />
          </div>
          <button
            type="submit"
            className="w-auto flex items-center justify-between py-2 px-4 bg-black text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="mr-20">Save</span>
            <Image
              src={InstallIcon}
              alt="Save Icon"
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoteOperatoin;
