'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NodeIcon from '@/assets/icons/node.svg';
import ChevronIcon from '@/assets/icons/chevron.svg';

const Sidebar = ({ node, selectedItem, onSelectItem }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const validatorOperations = [
        'Validator List',
        'Edit Validator',
        'Withdraw Rewards',
        'Delegate',
        'Redelegate',
        'Vote',
        'Unjail',
        'Send Token',
        'Wallets',
        'Logs',
        'BLS Key',
        'Node Information',
    ];



    return (
        <div className="h-full w-[260px] bg-gray dark:bg-bg_dark_gray rounded-xl">
            <div className="h-full flex flex-col">
                {/* Node Info */}
                <div className="flex items-start mb-4 justify-between p-4">
                    <div className="flex items-center">
                        <Image
                            src={node.image[1].url}
                            alt={node.name}
                            width={80}
                            height={80}
                            className="rounded-xl shadow-md mr-4"
                        />
                        <div>
                            <div className="flex items-center">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {node.name}
                                </h3>
                            </div>
                            <p className="text-sm mt-1 text-text_gray">
                                {node.chain_registry_identifier}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Validator Operation Section */}
                <div className="w-full px-4">
                    <button
                        onClick={toggleCollapse}
                        className="flex items-center w-full text-left text-xs font-medium uppercase text-text_gray mb-2 focus:outline-none"
                    >
                        <Image src={NodeIcon} alt="Validator Operation" width={20} height={20} className="mr-2" />
                        <span>Validator Operation</span>
                        <Image
                            src={ChevronIcon}
                            alt="Toggle"
                            width={16}
                            height={16}
                            className={`ml-auto transform transition-transform duration-300 ${collapsed ? '-rotate-90' : 'rotate-0'}`}
                        />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
                        <nav className="flex flex-col space-y-1 mt-2">
                            {validatorOperations.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelectItem(item)}
                                    className={`block w-full text-left hover:bg-hover_gray rounded-lg overflow-hidden ${selectedItem === item ? 'bg-selected_bg' : ''
                                        } transform transition-all duration-300 ease-in-out opacity-0 translate-y-2 animate-fade-in-down`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center px-4 py-2">
                                        <span className="text-base font-normal leading-[20px] tracking-[-0.32px] text-text_gray">
                                            {item}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

