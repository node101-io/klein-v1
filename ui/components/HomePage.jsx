'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import SearchIcon from '@/assets/icons/search.svg';
import HelpIcon from '@/assets/icons/help.svg';
import ArrowIcon from '@/assets/icons/arrow.svg';
import NodeCard from './common/NodeCard';

const NodeExplorer = ({ nodes }) => {
    const [network, setNetwork] = useState('all');

    const filteredNodes = nodes.filter(node => {
        const matchesNetwork = network === 'all' || node.network === network;
        const matchesSearch = node.name.toLowerCase();
        return matchesNetwork && matchesSearch;
    });

    return (
        <>
            <div className="space-x-2 mb-6">
                {['all', 'mainnet', 'testnet'].map(net => (
                    <button
                        key={net}
                        onClick={() => setNetwork(net)}
                        className={`px-4 py-2 pr-12 transition-colors  ${network === net
                            ? 'border-b-[1px] border-b-blue_klein text-black'
                            : ' text-gray-700 hover:bg-gray dark:bg-bg_dark_gray'
                            }`}
                    >
                        {net.charAt(0).toUpperCase() + net.slice(1)}
                    </button>
                ))}
            </div>


            <div className="grid gap-6 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-2">
                {filteredNodes.map((node) => (
                    <NodeCard key={node.id} node={node} />

                ))}
            </div>
        </>
    );
};

export default NodeExplorer;
