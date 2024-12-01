import React from 'react'

import { nodes as Nodes } from '@/utils/mocked-nodes'
import NodeExplorer from '@/components/NodeExplorer';

const page = () => {
    return (
        <div className="flex flex-col h-full p-6 bg-gray dark:bg-bg_dark_gray rounded-xl overflow-y-scroll no-scrollbar">
            <NodeExplorer nodes={Nodes} />
        </div>
    )
}

export default page