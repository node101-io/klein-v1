import React, { useState } from "react";
import { ClipboardCopy, Trash2 } from "lucide-react";
import Image from "next/image";

import Input from "@/components/common/input";
import HelpIcon from "@/assets/icons/help.svg";
import Tooltip from "@/components/common/Tooltip";
import InstallIcon from "@/assets/icons/install-icon.svg";

interface WalletEntry {
  id: string;
  name: string;
}

const WalletOperation = () => {
  const [walletName, setWalletName] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [wallets, setWallets] = useState<WalletEntry[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: `wallet-${i}`,
      name: "band...hqvz7",
    }))
  );

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating wallet:", walletName);
  };

  const handleRecoverWallet = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recovering wallet:", recoveryPhrase);
  };

  const handleCopyWallet = (wallet: WalletEntry) => {
    console.log("Copying wallet:", wallet.name);
  };

  const handleDeleteWallet = (walletId: string) => {
    setWallets(wallets.filter((wallet) => wallet.id !== walletId));
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-[32px] font-light text-[#525252]">Wallet</h1>
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

      <div className="mb-12">
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light">Create Wallet</h2>
          <Tooltip content="Learn about creating wallets">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <form
          onSubmit={handleCreateWallet}
          className="space-y-4"
        >
          <Input
            label="Wallet Name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            name="Enter wallet name"
          />
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

      {/* Recover Wallet Section */}
      <div className="mb-12">
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light">Recover Wallet</h2>
          <Tooltip content="Learn about wallet recovery">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <form
          onSubmit={handleRecoverWallet}
          className="space-y-4"
        >
          <Input
            label="Recovery Phrase"
            value={recoveryPhrase}
            onChange={(e) => setRecoveryPhrase(e.target.value)}
            name="Enter recovery phrase"
          />
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

      <div>
        <div className="flex items-center gap-x-2 mb-4">
          <h2 className="text-xl font-light">Wallet List</h2>
          <Tooltip content="View your wallets">
            <Image
              src={HelpIcon}
              alt="Help"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
            >
              <div>
                <div className="text-sm text-gray-500 mb-1">Label</div>
                <div className="text-gray-700">{wallet.name}</div>
              </div>
              <div className="flex gap-x-2">
                <button
                  onClick={() => handleCopyWallet(wallet)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ClipboardCopy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteWallet(wallet.id)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletOperation;
