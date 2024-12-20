import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/input";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";
import HelpIcon from "@/assets/icons/help.svg";

interface ValidatorInputs {
  selfStakeAmount: string;
  maxCommissionRate: string;
  commissionMaxChangeRate: string;
  commissionRate: string;
  gassFees: string;
  walletKeyName: string;
  moniker: string;
  details: string;
  identity: string;
  securityContact: string;
  website: string;
}

const CreateValidator = () => {
  const [inputs, setInputs] = useState<ValidatorInputs>({
    selfStakeAmount: "",
    maxCommissionRate: "",
    commissionMaxChangeRate: "",
    commissionRate: "",
    gassFees: "",
    walletKeyName: "",
    moniker: "",
    details: "",
    identity: "",
    securityContact: "",
    website: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputs);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full overflow-auto"
    >
      <div className="flex gap-x-4 items-center mb-8">
        <h2 className="text-2xl font-light">Create Validator</h2>
        <Tooltip content="Click here to learn about creating validators">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Input
          label="Self Stake Amount"
          name="selfStakeAmount"
          value={inputs.selfStakeAmount}
          onChange={handleInputChange}
          helperText="Enter the self stake amount"
        />
        <Input
          label="Max Commission Rate"
          name="maxCommissionRate"
          value={inputs.maxCommissionRate}
          onChange={handleInputChange}
          helperText="Enter the maximum commission rate"
        />
        <Input
          label="Commission Max Change Rate"
          name="commissionMaxChangeRate"
          value={inputs.commissionMaxChangeRate}
          onChange={handleInputChange}
          helperText="Enter the maximum commission change rate"
        />
        <Input
          label="Commission Rate"
          name="commissionRate"
          value={inputs.commissionRate}
          onChange={handleInputChange}
          helperText="Enter the commission rate"
        />
        <Input
          label="Gas Fees"
          name="gassFees"
          value={inputs.gassFees}
          onChange={handleInputChange}
          helperText="Enter the gas fees"
        />
        <Input
          label="Wallet Key Name"
          name="walletKeyName"
          value={inputs.walletKeyName}
          onChange={handleInputChange}
          helperText="Enter your wallet key name"
        />
        <Input
          label="Moniker"
          name="moniker"
          value={inputs.moniker}
          onChange={handleInputChange}
          helperText="Enter the moniker"
        />
        <Input
          label="Details"
          name="details"
          value={inputs.details}
          onChange={handleInputChange}
          helperText="Enter additional details"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        <Input
          label="Identity"
          name="identity"
          value={inputs.identity}
          onChange={handleInputChange}
          helperText="Enter your identity"
        />
        <Input
          label="Security Contact"
          name="securityContact"
          value={inputs.securityContact}
          onChange={handleInputChange}
          helperText="Enter security contact information"
        />
        <Input
          label="Website"
          name="website"
          value={inputs.website}
          onChange={handleInputChange}
          helperText="Enter your website URL"
        />
      </div>

      <div className="flex justify-end">
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
      </div>
    </form>
  );
};

export default CreateValidator;
