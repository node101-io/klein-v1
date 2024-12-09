"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import InstallLoader from "@/components/install/install-loader";
import Warning from "@/assets/icons/warning.svg";
import { fetchProjectById } from "@/services/api";
import { Project } from "@/types/projects.types";
import Check from "@/assets/icons/check.svg";

const InstallPage: React.FC = () => {
  const [installing, setInstalling] = useState<boolean>(true);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [node, setNode] = useState<Project | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      const getProjectData = async () => {
        try {
          const projectData = await fetchProjectById(id);
          setNode(projectData);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };
      getProjectData();
    }
  }, [id]);

  if (!id) {
    return <div>No ID provided in query parameters.</div>;
  }

  if (!node) {
    return <div>Loading...</div>;
  }

  const handleInstallComplete = () => {
    setInstalling(false);
  };

  const handleCancel = () => {
    setInstalling(false);
    setCancelled(true);
  };

  const handleDiveIn = () => {
    router.push(`/node-overview/?id=${id}`);
  };

  return (
    <div className="flex flex-row w-full h-full gap-x-4">
      <div className="px-12 flex-1 bg-gray rounded-xl overflow-hidden">
        <div className="flex flex-col items-start justify-center pt-52">
          <div className="flex flex-col space-y-6 mb-8">
            <div className="flex items-center">
              <Image
                src={node.image[1].url}
                alt={node.name}
                width={100}
                height={100}
                className="rounded-xl shadow-md mr-4"
              />
              <div>
                <p className="mt-1 text-lg">Provider</p>
                <p className="text-sm mt-1 text-text_gray">
                  {node.chain_registry_identifier}
                </p>
              </div>
            </div>
            <p>
              Stake your coins to our validators in the projects you choose.
              node101 gives you the opportunity to stake the best projects.
            </p>
            <div className="flex flex-row space-x-2">
              <Image
                src={!installing && !cancelled ? Check : Warning}
                alt="Warning"
                width={22}
                height={22}
              />
              <p
                className={`text-[16px] ${
                  !installing && !cancelled ? "text-[#5964FA]" : ""
                }`}
              >
                {cancelled
                  ? "You have cancelled the installation."
                  : installing
                  ? "The installation process might take a while."
                  : "Installation Completed!"}
              </p>
            </div>
          </div>
          {installing && !cancelled && (
            <InstallLoader
              totalSteps={100}
              onComplete={handleInstallComplete}
              cancelled={cancelled}
            />
          )}
          <div className="pt-10 flex w-full justify-end">
            {installing && !cancelled && (
              <button
                onClick={handleCancel}
                className="px-16 py-2 bg-black text-white rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            )}
            {!installing && !cancelled && (
              <button
                onClick={handleDiveIn}
                className="px-16 py-2 bg-black text-white rounded-md hover:bg-[#12223b]"
              >
                Dive In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPage;
