'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import Sidebar from '@/components/connect/Sidebar-connect';
import InstallLoader from '@/components/InstallLoader';
import { nodes } from '@/utils/mocked-nodes';
import Warning from '@/assets/icons/warning.svg';

const Page = () => {
  const [installing, setInstalling] = useState(true);
  const [cancelled, setCancelled] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [node, setNode] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      const foundNode = nodes.find((n) => n.id === parseInt(id));
      setNode(foundNode);
    }
  }, [id]);

  if (!id) {
    return <div>No ID provided in query parameters.</div>;
  }

  if (!node) {
    return null;
  }

  const handleSelectItem = (item) => {
    if (!installing) {
      setSelectedItem(item);
    }
  };

  const handleInstallComplete = () => {
    setInstalling(false);
  };

  const handleCancel = () => {
    setInstalling(false);
    setCancelled(true);
  };

  return (
    <div className="flex flex-row w-full h-full gap-x-4">
      <div
        className={`transition-opacity duration-300 ${installing ? 'opacity-50 pointer-events-none' : ''
          }`}
      >
        <Sidebar node={node} selectedItem={selectedItem} onSelectItem={handleSelectItem} />
      </div>
      <div className="px-12 flex-1 bg-gray rounded-xl overflow-hidden">
        {installing || cancelled ? (
          <div className="flex flex-col items-start justify-center pt-52">
            <div className="flex flex-col space-y-6 mb-8">
              <div className="flex items-center">
                <Image
                  src={node.image}
                  alt={node.name}
                  width={100}
                  height={100}
                  className="rounded-xl shadow-md mr-4"
                />
                <div>
                  <p className=' mt-1 text-lg'>
                    Provider
                  </p>
                  <p className="text-md text-text_gray">
                    {node.network.charAt(0).toUpperCase() + node.network.slice(1)}
                  </p>
                </div>
              </div>
              <p>
                Stake your coins to our validators in the projects you choose. node101 gives you the opportunity to stake the best projects.
              </p>
              <div className='flex flex-row space-x-2'>
                <Image src={Warning} alt={Warning} width={22} height={22} />
                <p>
                  {cancelled ? "You have cancelled the installation." : "The installation process might take a while."}
                </p>
              </div>
            </div>
            <InstallLoader totalSteps={100} onComplete={handleInstallComplete} cancelled={cancelled} />
            <div className='pt-10 flex w-full justify-end'>
              <button
                onClick={handleCancel}
                className="px-12 py-3 bg-black text-white font-semibold rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
          //  ) :
          //  cancelled ? (
          //    <div className="flex flex-col items-center justify-center h-full text-center">
          //      <h1 className="text-3xl font-bold text-red-500 mb-4">Installation Cancelled</h1>
          //      <p className="text-lg text-gray-700">You have cancelled the installation.</p>
          //    </div>
        ) : selectedItem ? (
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{selectedItem}</h1>
            {/* Render content based on selectedItem */}
          </div>
        ) : (
          <div className="p-4">Please select an operation from the sidebar.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
