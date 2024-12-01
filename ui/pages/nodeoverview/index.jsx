'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Sidebar from '@/components/connect/Sidebar-connect';
import NodeOperations from '@/components/operations/node-overview/node-overview';

import { fetchProjectById } from '@/services/api';
import EditValidator from '@/components/operations/edit-validator.jsx/EditValidator';

const NodeOverviewPage = () => {
    const [selectedItem, setSelectedItem] = useState('Node Operations');
    const [node, setNode] = useState(null);
    const [hasUpdate, setHasUpdate] = useState(true);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            const getProjectData = async () => {
                try {
                    const projectData = await fetchProjectById(id);
                    setNode(projectData);
                } catch (error) {
                    console.error('Error fetching project:', error);
                }
            };

            getProjectData();
        }
    }, [id]);

    if (!id) {
        return <div>No ID provided in query parameters.</div>;
    }

    if (!node) {
        return <div>Loading...</div>;
    }

    const handleSelectItem = (item) => {
        setSelectedItem(item);
    };

    const handleNodeOperation = (operation) => {
        alert(`${operation}`);
    };

    return (
        <div className="flex flex-row w-full h-full gap-x-4">
            <Sidebar
                node={node}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                hasUpdate={hasUpdate}
                onNodeOperation={handleNodeOperation}
            />
            <div className="p-14 flex-1 bg-gray rounded-xl overflow-hidden">
                {selectedItem === 'Node Operations' && (
                    <NodeOperations />
                )}
                {selectedItem === 'Edit Validator' && (
                    <EditValidator />
                )}
            </div>
        </div>
    );
};

export default NodeOverviewPage;
