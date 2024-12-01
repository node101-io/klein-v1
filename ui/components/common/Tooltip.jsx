import React from 'react';

const Tooltip = ({ content, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
            <div className="relative bg-[#191919] text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                {content}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black"></div>
            </div>
        </div>
    </div>
);

export default Tooltip;
