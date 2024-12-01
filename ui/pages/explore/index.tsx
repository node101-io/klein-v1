import React from "react";

import NodeExplorer from "@/components/explorer/node-explorer";

const page = () => {
  return (
    <div className="flex flex-col h-full p-6 bg-gray dark:bg-bg_dark_gray rounded-xl overflow-y-scroll no-scrollbar">
      <NodeExplorer />
    </div>
  );
};

export default page;
