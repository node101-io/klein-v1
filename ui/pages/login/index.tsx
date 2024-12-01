import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { fetchProjectById } from "@/services/api";
import HelpIcon from "@/assets/icons/help.svg";
import EyeIcon from "@/assets/icons/Eyeicon.svg";
import EyeCloseIcon from "@/assets/icons/EyeCloseIcon.svg";
import InstallIcon from "@/assets/icons/install-icon.svg";
import Tooltip from "@/components/common/Tooltip";
import { Project } from "@/types/projects.types";

interface RequirementItemProps {
  label: string;
  value?: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center bg-[#EAEAEA] p-4 rounded-md">
    <span className="text-gray-700">{label}</span>
    <span className="text-text_purple">{value || "N/A"}</span>
  </div>
);

const LoginPage: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const router = useRouter();
  const { id } = router.query as { id: string };

  useEffect(() => {
    if (id) {
      const getProjectData = async () => {
        try {
          const projectData = await fetchProjectById(id);
          setProject(projectData);
        } catch (error) {
          console.error("Error fetching project:", error);
          setError("Failed to load project data.");
        }
      };

      getProjectData();
    }
  }, [id]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/install?id=${id}`);
  };

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const willInstall = true;

  const rentServers: Record<string, string> = {
    AWS: "https://aws.amazon.com",
    "Google Cloud": "https://cloud.google.com",
    Azure: "https://azure.microsoft.com",
  };

  return (
    <div className="flex flex-col md:flex-row h-full p-6 bg-gray rounded-xl">
      {/* Left Side */}
      <div className="flex-1 p-6">
        <div className="w-full h-full flex flex-col justify-center">
          <div className="flex justify-start">
            <div className="flex items-center">
              <Image
                src={project.image[project.image.length - 1].url}
                alt={`Project image ${project.name}`}
                width={100}
                height={100}
                className="rounded-lg mr-4"
              />
              <div>
                <div className="flex items-center gap-x-2">
                  <h1 className="text-3xl font-semibold">{project.name}</h1>
                  <Tooltip content="Click here to learn about Aleo">
                    <a
                      href={project.urls.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit h-fit pt-1"
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
                <p className="text-lg text-gray-600">
                  {project.chain_registry_identifier}
                </p>
                <div className="mt-2 px-2 py-1 border border-[#AAB3FF] rounded-lg text-xs text-[#AAB3FF] w-fit">
                  {project.properties.is_incentivized
                    ? "Incentivized"
                    : "Non-Incentivized"}
                </div>
              </div>
            </div>
          </div>

          <p className="my-6 text-gray-700">{project.description}</p>

          {willInstall && (
            <div>
              <input
                type="hidden"
                id="index-login-project-identifier"
                value={project.chain_registry_identifier}
              />

              <div className="mb-6">
                <h2 className="text-[16px] text-text_purple mb-4">
                  System Requirements
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {["CPU", "RAM", "Storage", "OS"].map((item) => (
                    <RequirementItem
                      key={item}
                      label={item}
                      value={
                        project.system_requirements[
                          item.toLowerCase() as keyof typeof project.system_requirements
                        ]
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-[16px] mb-4">Rent a Server</h2>
                <div className="flex items-center gap-4">
                  {Object.entries(rentServers).map(
                    ([name, url], index, array) => (
                      <React.Fragment key={name}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A6A6A6] hover:underline"
                        >
                          {name}
                        </a>
                        {index < array.length - 1 && (
                          <span className="bg-[#A6A6A6] h-6 w-[1px]" />
                        )}
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <h2 className="text-[36px] mb-6">
            Sign in to your server to continue!
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="ipAddress"
                className="block text-sm text-gray-700 mb-1"
              >
                Your IP Address
              </label>
              <input
                type="text"
                id="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="block w-full border border-[#1E1E1E] rounded-lg py-3 pl-4 focus:outline-none"
                placeholder="Enter your server's IP address"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-gray-50 border border-[#1E1E1E] rounded-lg py-3 pl-4"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <Image
                      src={EyeCloseIcon}
                      alt="Hide Password"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src={EyeIcon}
                      alt="Show Password"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              </div>
            </div>

            <div
              className="flex items-center mb-6 cursor-pointer"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={() => {}}
                className="h-4 w-4 rounded text-black focus:ring-0"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>

            {error && <div className="mb-4 text-red-500">{error}</div>}
            <button
              type="submit"
              className="flex w-fit gap-x-12 py-2 px-4 bg-black text-white rounded-md hover:bg-opacity-90 focus:outline-none"
            >
              {willInstall ? "Install" : "Login"}
              <Image
                src={InstallIcon}
                alt="Install Icon"
                width={24}
                height={24}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
