import React from 'react';
import Image from 'next/image';
import HelpIcon from '@/assets/icons/help.svg';
import Tooltip from '@/components/common/Tooltip';
import WarningIcon from '@/assets/icons/warning.svg';
import SyncStatusIndicator from './sync-status-indicator';

const OverviewCard = ({
    title,
    value,
    info,
    warning,
    color,
    details,
    type = 'default',
    currentBlock,
    latestBlock,
    failedBlocks,
}) => {
    const getTextColor = () => {
        return color === 'red' ? 'text-[#FF1F1F]' : 'text-black';
    };

    const getProgressBarColor = () => {
        return color === 'red' ? 'bg-[#FF1F1F]' : 'bg-[#4B5FE5]';
    };

    const getProgressWidth = () => {
        const numericValue = parseInt(value.replace('%', ''), 10);
        if (isNaN(numericValue)) return '100%';
        return `${Math.min(numericValue, 100)}%`;
    };

    return (
        <div className="bg-white rounded-[24px] p-6 flex flex-col justify-between h-full">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h2 className={`text-lg ${getTextColor()}`}>{title}</h2>
                    <Tooltip content={info}>
                        <Image src={HelpIcon} alt="Help Icon" width={20} height={20} />
                    </Tooltip>
                </div>

                <div className="flex items-center gap-2 pb-1">
                    <span className={`text-4xl font-bold ${getTextColor()}`}>{value}</span>
                    {warning && (
                        <Image
                            src={WarningIcon}
                            alt="Warning Icon"
                            width={20}
                            height={20}
                            className="text-[#FF1F1F]"
                        />
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

            {type === 'default' && (
                <div
                    className="w-full h-[10px] rounded-full overflow-hidden"
                    style={{ backgroundColor: '#D9D9D9' }}
                >
                    <div
                        className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
                        style={{ width: getProgressWidth() }}
                    />
                </div>
            )}
            {type === 'sync' && (
                <div className="mt-4">
                    <SyncStatusIndicator
                        currentBlock={currentBlock}
                        failedBlocks={failedBlocks}
                    />
                </div>
            )}
        </div>
    );
};



export default OverviewCard;

