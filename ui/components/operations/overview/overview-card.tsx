import React from "react";
import Image from "next/image";
import HelpIcon from "@/assets/icons/help.svg";
import Tooltip from "@/components/common/Tooltip";
import WarningIcon from "@/assets/icons/warning.svg";
import SyncStatusIndicator from "./sync-status-indicator";

interface OverviewCardProps {
  title: string;
  value: string;
  info: string;
  details: string[];
  type?: string;
  currentBlock?: number;
  failedBlocks?: number[];
  color?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  info,
  details,
  type = "default",
  currentBlock,
  failedBlocks,
}) => {
  const getNumericValue = (): number => {
    const numericValue = parseFloat(value.toString().replace("%", ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const isValueOverThreshold = (): boolean => {
    return getNumericValue() > 80;
  };

  const getTextColor = (): string => {
    return isValueOverThreshold() ? "text-[#FF1F1F]" : "text-black";
  };

  const getProgressBarColor = (): string => {
    return isValueOverThreshold() ? "bg-[#FF1F1F]" : "bg-[#4B5FE5]";
  };

  const getProgressWidth = (): string => {
    const numericValue = getNumericValue();
    return `${Math.min(numericValue, 100)}%`;
  };

  const showWarning = isValueOverThreshold();

  return (
    <div className="bg-white rounded-[24px] p-6 flex flex-col justify-between h-full">
      <div className="space-y-2">
        <div className="flex items-center gap-2 ">
          <h2 className={`text-lg ${getTextColor()}`}>{title}</h2>
          {info && (
            <Tooltip content={info}>
              <Image
                src={HelpIcon}
                alt="Help Icon"
                width={20}
                height={20}
              />
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-2 py-2">
          <span
            className={`text-[48px] leading-[20px] font-medium ${getTextColor()}`}
          >
            {value}
          </span>
          {showWarning && (
            <Tooltip
              background="#FF1F1F"
              content="The usage is high"
            >
              <Image
                src={WarningIcon}
                alt="Warning Icon"
                width={20}
                height={20}
                className="text-[#FF1F1F]"
              />
            </Tooltip>
          )}
        </div>

        {details && (
          <div className="space-y-1 text-sm text-text_gray pb-4">
            {details.map((detail, index) => (
              <p key={index}>{detail}</p>
            ))}
          </div>
        )}
      </div>

      {type === "default" && (
        <div
          className="w-full h-[10px] rounded-full overflow-hidden"
          style={{ backgroundColor: "#D9D9D9" }}
        >
          <div
            className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: getProgressWidth() }}
          />
        </div>
      )}
      {type === "sync" && currentBlock !== undefined && (
        <div className="mt-4">
          <SyncStatusIndicator
            currentBlock={currentBlock}
            failedBlocks={failedBlocks || []}
          />
        </div>
      )}
    </div>
  );
};

export default OverviewCard;
