"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import KleinLogo from "@/assets/full-klein.svg";
import InstallIcon from "@/assets/icons/install-icon.svg";
import TelegramLogo from "@/assets/icons/socialmedia/telegram.svg";
import TwitterLogo from "@/assets/icons/socialmedia/twitter.svg";
import { Twitter } from "lucide-react";

export default function LoginPage() {
  const [uniqueKey, setUniqueKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full flex">
      {/* Left Section */}
      <div className="flex-1 p-8 flex flex-col ">
        <div>
          <Image
            src={KleinLogo}
            alt="Klein Logo"
            width={108}
            height={32}
            className="w-[144px] h-8"
          />
        </div>

        <div className="max-w-lg mt-auto">
          <h1 className="text-[36px] font-medium mb-8">
            Enter the "Unique Key" if Klein is installed on your device!
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="uniqueKey"
                className="block text-sm mb-2"
              >
                Unique Key
              </label>
              <input
                id="uniqueKey"
                type="text"
                value={uniqueKey}
                onChange={(e) => setUniqueKey(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F8F8] rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Unique Key"
              />
              <p className="mt-2 text-sm text-gray-600">
                This key is randomly generated for safe Klein login. For more,{" "}
                <Link
                  href="#"
                  className="text-indigo-600 hover:underline"
                >
                  click here
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              className="flex w-fit gap-x-12 py-2 px-4 bg-black text-white rounded-md hover:bg-opacity-90 focus:outline-none"
            >
              Continue
              <Image
                src={InstallIcon}
                alt="Continue"
                width={20}
                height={20}
              />
            </button>
          </form>
        </div>

        <div className="mt-auto  flex items-center gap-4">
          <Link
            href="https://twitter.com/klein"
            className="hover:opacity-80"
          >
            <Image
              src={TwitterLogo}
              alt="Twitter"
              width={24}
              height={24}
            />
          </Link>
          <Link
            href="https://t.me/klein"
            className="hover:opacity-80"
          >
            <Image
              src={TelegramLogo}
              alt="Telegram"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-[#5964FA] rounded-[40px] flex p-8 aspect-[1/1.2]">
        <div className="w-full flex flex-col  text-white">
          <div className="bg-white/20 rounded-3xl p-8 mb-8 aspect-video flex items-center justify-center">
            <span className="text-4xl">GIF</span>
          </div>

          <h2 className="text-[64px] leading-[77px] mb-4">
            How to get<span className="font-semibold"> "Unique Key"?</span>
          </h2>
          <p className="text-[24px] mb-6">
            Klein maximizes your security with the "Unique Key" generated every
            time you log in.
          </p>
          <div>
            <button className="px-8 py-2 rounded-full border-2 border-white hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
