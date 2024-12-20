import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/input";
import HelpIcon from "@/assets/icons/help.svg";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";

interface StakingFormData {
  amount: string;
  fees: string;
  keyName: string;
  toAddress: string;
  fromAddress?: string;
}

const StakingOperations = () => {
  const [delegateForm, setDelegateForm] = useState<StakingFormData>({
    amount: "",
    fees: "",
    keyName: "",
    toAddress: "",
    fromAddress: "",
  });

  const [redelegateForm, setRedelegateForm] = useState<StakingFormData>({
    amount: "",
    fees: "",
    keyName: "",
    toAddress: "",
    fromAddress: "",
  });

  const [undelegateForm, setUndelegateForm] = useState<StakingFormData>({
    amount: "",
    fees: "",
    keyName: "",
    fromAddress: "",
    toAddress: "",
  });

  const handleDelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDelegateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRedelegateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUndelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUndelegateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Delegate form submitted:", delegateForm);
  };

  const handleRedelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Redelegate form submitted:", redelegateForm);
  };

  const handleUndelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Undelegate form submitted:", undelegateForm);
  };

  return (
    <div className="flex flex-col w-full h-full mb-8">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light text-[#525252]">
          Staking Operations
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
          <h2 className="text-xl font-light text-[#525252]">Delegate Tokens</h2>
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
              value={delegateForm.amount}
              onChange={handleDelegateChange}
            />
            <Input
              label="Fees"
              name="fees"
              value={delegateForm.fees}
              onChange={handleDelegateChange}
            />
            <Input
              label="Key Name"
              name="keyName"
              value={delegateForm.keyName}
              onChange={handleDelegateChange}
            />
            <Input
              label="To Volaper Address"
              name="toAddress"
              value={delegateForm.toAddress}
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

      <div className="mb-12">
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light text-[#525252]">
            Redelegate Tokens
          </h2>
          <Tooltip content="Learn about redelegating tokens">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <form
          onSubmit={handleRedelegateSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              name="amount"
              value={redelegateForm.amount}
              onChange={handleRedelegateChange}
            />
            <Input
              label="Fees"
              name="fees"
              value={redelegateForm.fees}
              onChange={handleRedelegateChange}
            />
            <Input
              label="Key Name"
              name="keyName"
              value={redelegateForm.keyName}
              onChange={handleRedelegateChange}
            />
            <Input
              label="From Volaper Address"
              name="fromAddress"
              value={redelegateForm.fromAddress}
              onChange={handleRedelegateChange}
            />
            <Input
              label="To Volaper Address"
              name="toAddress"
              value={redelegateForm.toAddress}
              onChange={handleRedelegateChange}
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

      <div className="mb-12">
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light text-[#525252]">
            Undelegate Tokens
          </h2>
          <Tooltip content="Learn about undelegating tokens">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <form
          onSubmit={handleUndelegateSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              name="amount"
              value={undelegateForm.amount}
              onChange={handleUndelegateChange}
            />
            <Input
              label="Fees"
              name="fees"
              value={undelegateForm.fees}
              onChange={handleUndelegateChange}
            />
            <Input
              label="Key Name"
              name="keyName"
              value={undelegateForm.keyName}
              onChange={handleUndelegateChange}
            />
            <Input
              label="From Volaper Address"
              name="fromAddress"
              value={undelegateForm.fromAddress}
              onChange={handleUndelegateChange}
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

export default StakingOperations;
