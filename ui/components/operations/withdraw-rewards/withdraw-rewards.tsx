import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/input";
import HelpIcon from "@/assets/icons/help.svg";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";

interface StakingFormData {
  amount: string;
  fees: string;
  toAddress: string;
}

const WithdrawRewards = () => {
  const [withdrawRewardForm, setWithdrawRewardForm] = useState<StakingFormData>(
    {
      amount: "",
      fees: "",
      toAddress: "",
    }
  );

  const handleDelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithdrawRewardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Withdraw Reward submitted:", withdrawRewardForm);
  };

  return (
    <div className="flex flex-col w-full h-full mb-8">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light text-[#525252]">
          Withdraw Rewards{" "}
        </h1>
        <Tooltip content="Click here to learn about Staking">
          <Image
            src={HelpIcon}
            alt="Help Icon"
            width={20}
            height={20}
          />
        </Tooltip>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light text-[#525252]">
            withdrawRewardForm
          </h2>
          <Tooltip content="Learn about delegating tokens">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <form
          onSubmit={handleDelegateSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              name="amount"
              value={withdrawRewardForm.amount}
              onChange={handleDelegateChange}
            />
            <Input
              label="Fees"
              name="fees"
              value={withdrawRewardForm.fees}
              onChange={handleDelegateChange}
            />
            <Input
              label="To Volaper Address"
              name="toAddress"
              value={withdrawRewardForm.toAddress}
              onChange={handleDelegateChange}
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

export default WithdrawRewards;
