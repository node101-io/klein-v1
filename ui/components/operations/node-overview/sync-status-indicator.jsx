import React from 'react';

// interface SyncStatusIndicatorProps {
//     total: number;
//     current: number;
//     rows?: number;
// }

const SyncStatusIndicator = ({ total = 100, current, rows = 2 }) => {
    const itemsPerRow = Math.ceil(total / rows);

    const indicators = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: itemsPerRow }, (_, i) => {
            const itemIndex = rowIndex * itemsPerRow + i;
            return itemIndex < total ? itemIndex : null;
        }).filter(Boolean)
    );

    return (
        <div className="flex flex-col gap-1">
            {indicators.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-between gap-[1px]">
                    {row.map((_, i) => {
                        const itemIndex = rowIndex * itemsPerRow + i;
                        return (
                            <div
                                key={i}
                                className={`h-[10px] w-[4px] rounded-full hover:scale-150 hover:cursor-pointer transition-all duration-300 ease-in-out ${itemIndex === current ? 'bg-[#FF1F1F] animate-pulse' : 'bg-[#AAB3FF]'
                                    }`}
                                style={{
                                    animation: itemIndex === current ? 'pulse 1.5s infinite' : 'none',
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default SyncStatusIndicator;

