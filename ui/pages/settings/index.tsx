"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ToggleSwitch } from "@/components/common/ui/toggle-switch";
import HelpIcon from "@/assets/icons/help.svg";
import LogoutIcon from "@/assets/icons/settings/logout-icon.svg";
import UKFlag from "@/assets/icons/settings/uk-flag.svg";
import TRFlag from "@/assets/icons/settings/tr-flag.svg";
import DeleteIcon from "@/assets/icons/settings/delete-icon.svg";
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<"EN" | "TR">("EN");
  const [privacyToggles, setPrivacyToggles] = useState({
    usageData: true,
    installationData: false,
    taskCompletionData: true,
    performanceData: true,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const passwordsRef = useRef<HTMLDivElement>(null);
  const oneKeyRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (contentRef.current && ref.current) {
      const topOffset = ref.current.offsetTop - contentRef.current.offsetTop;
      contentRef.current.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  const handlePrivacyToggle = (key: keyof typeof privacyToggles) => {
    setPrivacyToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeServers = [
    { name: "Babylon", status: "Delete" },
    { name: "Archway", status: "Delete" },
    { name: "Cosmos", status: "Add 'one-key'" },
  ];

  return (
    <div className="h-full rounded-xl p-14 bg-gray dark:bg-bg_dark_gray flex">
      {/* Sidebar */}
      <div className="flex h-full items-center">
        <div className="w-64  h-fit rounded-l-xl overflow-y-auto flex-shrink-0">
          <div className="p-6 space-y-8">
            <h2 className="text-sm font-medium text-text_gray">APP SETTINGS</h2>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text_gray">APPEARANCE</h3>
              <div className="ml-4 space-y-[28px]">
                <button
                  onClick={() => scrollToSection(themeRef)}
                  className="block text-text_gray hover:text-black"
                >
                  Theme
                </button>
                <button
                  onClick={() => scrollToSection(languageRef)}
                  className="block text-text_gray hover:text-black"
                >
                  Language
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text_gray">
                PASSWORDS & PRIVACY
              </h3>
              <div className="ml-4 space-y-[28px]">
                <button
                  onClick={() => scrollToSection(passwordsRef)}
                  className="block text-text_gray hover:text-black"
                >
                  Passwords
                </button>
                <button
                  onClick={() => scrollToSection(oneKeyRef)}
                  className="block text-text_gray hover:text-black"
                >
                  One-Key
                </button>
                <button
                  onClick={() => scrollToSection(privacyRef)}
                  className="block text-text_gray hover:text-black"
                >
                  Privacy
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text_gray">ABOUT</h3>
              <div className="ml-4 space-y-[28px]">
                <a
                  href="#"
                  className="flex items-center gap-2 text-text_gray hover:text-black"
                >
                  What's New On Klein
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>

            <button className="flex items-center gap-2 text-text_gray hover:text-black">
              <Image
                src={LogoutIcon}
                alt="Logout"
                width={20}
                height={20}
              />
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="w-px h-[calc(100%-40px)]  bg-gradient-to-b from-[#EEE] via-[#CECECE] to-[#EEE]" />
      {/* Main Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto  rounded-r-xl"
      >
        <div className="max-w-3xl mx-auto p-14">
          <div className="flex gap-x-4 items-center mb-8">
            <h1 className="text-[32px] font-light text-[#525252]">Settings</h1>
            <Image
              src={HelpIcon}
              alt="Help Icon"
              width={20}
              height={20}
            />
          </div>

          <div
            ref={themeRef}
            className="mb-12"
          >
            <h2 className="text-xl font-light text-[#525252] mb-6">THEME</h2>
            <div className="flex items-center justify-between">
              <span className="text-[#525252]">Dark Mode</span>
              <ToggleSwitch
                id="dark-mode-toggle"
                checked={theme === "dark"}
                onChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>

          <div
            ref={languageRef}
            className="mb-12"
          >
            <h2 className="text-xl font-light text-[#525252] mb-6">LANGUAGE</h2>
            <div className="space-y-4">
              <button
                onClick={() => setLanguage("EN")}
                className={`flex items-center gap-2 p-2 rounded ${
                  language === "EN" ? "bg-gray-100" : ""
                }`}
              >
                <Image
                  src={UKFlag}
                  alt="English"
                  width={24}
                  height={24}
                />
                <span className="text-[#525252]">EN</span>
              </button>
              <button
                onClick={() => setLanguage("TR")}
                className={`flex items-center gap-2 p-2 rounded ${
                  language === "TR" ? "bg-gray-100" : ""
                }`}
              >
                <Image
                  src={TRFlag}
                  alt="Turkish"
                  width={24}
                  height={24}
                />
                <span className="text-[#525252]">TR</span>
              </button>
            </div>
          </div>

          <div
            ref={passwordsRef}
            className="mb-12"
          >
            <h2 className="text-xl font-light text-[#525252] mb-6">
              PASSWORDS & PRIVACY
            </h2>
            <div className="space-y-4">
              <p className="text-[#525252]">
                Klein does not store your passwords!
              </p>
              <p className="text-[#525252]">
                Klein cares about privacy and security as core values of the
                decentralization of the world, so Klein does not keep, save, or
                share any information related to you or your node or server.
              </p>
              <p className="text-[#525252]">
                Your Private Key, Your Node, Your Privacy.
              </p>
            </div>
          </div>

          <div
            ref={oneKeyRef}
            className="mb-12"
          >
            <h2 className="text-xl font-light text-[#525252] mb-6">ONE-KEY</h2>
            <div className="space-y-6">
              <p className="text-[#525252]">
                Klein allows you to manage your nodes on more than one server.
                However, re-entering your passwords each time to switch between
                these servers may become frustrating.
              </p>
              <p className="text-[#525252]">
                With this feature, you can create a specific authentication
                method called "One-Key" using "SSH Key Authentication" by
                setting your servers up. Then, you use your "One-Key" to connect
                your servers without storing your server passwords on your
                device or Klein.
              </p>
              <div className="space-y-4">
                <h3 className="font-medium text-[#525252]">
                  One-Key Feature Active Servers
                </h3>
                {activeServers.map((server, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-md"
                  >
                    <span className="text-[#525252]">{server.name}</span>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                      {server.status === "Delete" && (
                        <Image
                          src={DeleteIcon}
                          alt="Delete"
                          width={16}
                          height={16}
                        />
                      )}
                      {server.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={privacyRef}
            className="mb-12"
          >
            <h2 className="text-xl font-light text-[#525252] mb-6">PRIVACY</h2>
            <div className="space-y-6">
              <h3 className="font-medium text-[#525252]">
                How Klein Uses Your Data
              </h3>
              <p className="text-[#525252]">
                The data Klein keeps centrally is anonymous in data tracking
                processes that are limited to tracking your activities to
                improve Klein.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#525252]">
                      Usage Data of User Interface
                    </h4>
                    <p className="text-sm text-[#525252]">
                      We keep this data anonymous so that necessary UX/UI
                      changes can be made to the Klein experience.
                    </p>
                  </div>
                  <ToggleSwitch
                    id="usage-data-toggle"
                    checked={privacyToggles.usageData}
                    onChange={() => handlePrivacyToggle("usageData")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#525252]">
                      Installation Demand Data of Nodes
                    </h4>
                    <p className="text-sm text-[#525252]">
                      We keep this data anonymous to track which testnet/mainnet
                      nodes Klein users are more interested in.
                    </p>
                  </div>
                  <ToggleSwitch
                    id="installation-data-toggle"
                    checked={privacyToggles.installationData}
                    onChange={() => handlePrivacyToggle("installationData")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#525252]">
                      Task Completion Data
                    </h4>
                    <p className="text-sm text-[#525252]">
                      We keep this data anonymous to track to which extent Klein
                      users' testnet tasks are completed.
                    </p>
                  </div>
                  <ToggleSwitch
                    id="task-completion-toggle"
                    checked={privacyToggles.taskCompletionData}
                    onChange={() => handlePrivacyToggle("taskCompletionData")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#525252]">
                      Performance Data & Crash Reports
                    </h4>
                    <p className="text-sm text-[#525252]">
                      We keep this data anonymous to monitor whether the
                      features offered by Klein are working or not.
                    </p>
                  </div>
                  <ToggleSwitch
                    id="performance-data-toggle"
                    checked={privacyToggles.performanceData}
                    onChange={() => handlePrivacyToggle("performanceData")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
