import React from 'react';
import Image from 'next/image';
import HelpIcon from '@/assets/icons/help.svg';

import Tooltip from '@/components/common/Tooltip';
import OverviewCard from './overview-card';

const NodeOperations = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-x-4 items-center mb-8">
        <h1 className="text-xl font-light">Node Overview</h1>
        <Tooltip content="Click here to learn about Aleo">
          <a
            href="https://node101.io"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit h-fit"
          >
            <Image src={HelpIcon} alt="Help Icon" width={20} height={20} />
          </a>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <OverviewCard
          title="Sync Status"
          value="960.06k"
          info="Current synchronization status of the node"
          color="purple"
          type="sync"
          syncStatus={{
            total: 99,
            current: 75,
          }}
          details={['Current Block 12358728000', 'Latest Block 22358728000']}
        />

        <OverviewCard
          title="CPU"
          value="50%"
          info="Current CPU usage of the node"
          color="blue"
          details={['Lorem ipsum dolor sit amet consectetur']}
        />

        <OverviewCard
          title="Memory"
          value="90%"
          info="Current memory usage of the node"
          color="red"
          details={['Lorem ipsum dolor sit amet consectetur']}
          warning={true}
        />
      </div>
    </div>
  );
};

export default NodeOperations;
