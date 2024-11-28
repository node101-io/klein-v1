'use client';

import React from 'react';

const ConnectClientComponent = ({ id }) => {
    const handleConnectClick = () => {
        alert(`Connecting to Node ${id}...`);
    };

    return (
        <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleConnectClick}
        >

            Connect Now {id}
        </button>
    );
};

export default ConnectClientComponent;
