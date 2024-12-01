import React from 'react';
import Link from 'next/link';

// interface SyncStatusIndicatorProps {
//   currentBlock: number;
//   failedBlocks: number[];
// }

const SyncStatusIndicator = ({
    currentBlock,
    failedBlocks,
}) => {
    const totalBlocks = 100;
    const blocks = Array.from({ length: totalBlocks }, (_, i) => currentBlock - totalBlocks + 1 + i);

    return (
        <div className="flex flex-wrap gap-[1px]">
            {blocks.map((block) => (
                <Link
                    key={block}
                    href={`https://www.mintscan.io/cosmos/block/${block}`}
                    target='_blank'
                    className={`
            h-[10px] w-[4px] rounded-full
            transition-all duration-300 ease-in-out
            ${failedBlocks.includes(block) ? 'bg-[#FF1F1F]' : 'bg-[#AAB3FF]'}
            hover:scale-150 hover:cursor-pointer
          `}
                />
            ))}
        </div>
    );
};

export default SyncStatusIndicator;
