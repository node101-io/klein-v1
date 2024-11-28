import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProjectById } from '@/services/api';


import ArrowLink from "@/assets/icons/arrow.svg"
import EyeIcon from "@/assets/icons/Eyeicon.svg"
import EyeCloseIcon from "@/assets/icons/EyeCloseIcon.svg"
import MockedAleo from "@/assets/nodes/aleo.svg"
import InstallIcon from "@/assets/icons/install-icon.svg"


const LoginPage = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [project, setProject] = useState(null);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            const getProjectData = async () => {
                try {
                    const projectData = await fetchProjectById(id);
                    setProject(projectData);
                } catch (error) {
                    console.error('Error fetching project:', error);
                    setError('Failed to load project data.');
                }
            };

            getProjectData();
        }
    }, [id]);

    const handleLogin = (e) => {
        e.preventDefault();
        router.push(`/install?id=${id}`);
    };

    if (!project) {
        return <div>Loading project data...</div>;
    }

    const will_install = true;

    const rent_servers = {
        'AWS': 'https://aws.amazon.com',
        'Google Cloud': 'https://cloud.google.com',
        'Azure': 'https://azure.microsoft.com',
    };

    return (
        <div className="flex flex-col md:flex-row h-full p-6 bg-gray rounded-xl">
            {/* Left Side */}
            <div className="flex-1 p-6">
                <div className='w-full h-full flex flex-col justify-center'>

                    <div className="flex justify-between">

                        <div className="flex items-center mb-6">
                            <Image
                                // src={project.image[project.image.length - 1].url}
                                src={MockedAleo}
                                alt={`Project image ${project.name}`}
                                width={100}
                                height={100}
                                className="rounded-lg mr-4"
                            />
                            <div>
                                <h1 className="text-3xl font-semibold">{project.name}</h1>
                                <p className="text-lg text-gray-600">{project.chain_registry_identifier}</p>

                                <div className="mt-2 px-2 py-[1.5px] border border-[#AAB3FF] rounded-lg text-xs text-[#AAB3FF] w-fit">
                                    {project.properties.is_incentivized ? "Incentivized" : "Non-Incentivized"}
                                </div>

                            </div>
                        </div>
                        <a
                            href={project.urls.web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit h-fit"
                        >
                            <Image src={ArrowLink} alt="Arrow Link" width={34} height={34} />
                        </a>

                    </div>


                    <p className="mb-6 text-gray-700">{project.description}</p>

                    {will_install && (
                        <div>
                            <input
                                type="hidden"
                                id="index-login-project-identifier"
                                value={project.chain_registry_identifier}
                            />

                            {/* Requirements */}
                            <div className="mb-6">
                                <h2 className="text-[16px] text-text_purple mb-4">System Requirements</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center bg-[#EAEAEA] p-4 rounded-md">
                                        <span className="text-gray-700">CPU</span>
                                        <span className="text-text_purple">{project.system_requirements.cpu}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#EAEAEA] p-4 rounded-md">
                                        <span className="text-gray-700">RAM</span>
                                        <span className="text-text_purple">{project.system_requirements.ram}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#EAEAEA] p-4 rounded-md">
                                        <span className="text-gray-700">Storage</span>
                                        <span className="text-text_purple">{project.system_requirements.storage}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#EAEAEA] p-4 rounded-md">
                                        <span className="text-gray-700">OS</span>
                                        <span className="text-text_purple">{project.system_requirements.os}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rent Server */}
                            <div>
                                <h2 className="text-[16px] mb-4">Rent a Server</h2>
                                <div className="flex items-center gap-4">
                                    {Object.keys(rent_servers).map((rent_server, i) => (
                                        <React.Fragment key={rent_server}>
                                            <a
                                                href={rent_servers[rent_server]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#A6A6A6] hover:underline"
                                            >
                                                {rent_server}
                                            </a>
                                            {i !== Object.keys(rent_servers).length - 1 && (
                                                <span className="bg-[#A6A6A6] h-6 w-[1px] " />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Right Side */}
            <div className="flex-1 p-6 flex flex-col justify-center items-center">
                {/* Login Form */}
                <div className="w-full max-w-md">
                    <h2 className="text-[36px] mb-6">Sign in to your server to continue!</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="ipAddress" className="block text-sm  text-gray-700 mb-1">
                                Your IP Adress
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="ipAddress"
                                    value={ipAddress}
                                    onChange={(e) => setIpAddress(e.target.value)}
                                    className="block w-full border border-[#1E1E1E] rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your server's IP address"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400 transform rotate-0 transition-transform duration-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.5 7L10 11.5L14.5 7H5.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm  text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-gray-50 border border-[#1E1E1E] rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? (
                                        <Image src={EyeCloseIcon} alt="Arrow Link" width={24} height={24} />

                                    ) : (
                                        <Image src={EyeIcon} alt="Eye Icon" width={24} height={24} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div
                            className="flex items-center mb-6 cursor-pointer"
                            onClick={() => setRememberMe(!rememberMe)}
                        >
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => { }}
                                className="h-4 w-4 rounded text-black focus:ring-0"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                Remember Me
                            </label>

                        </div>

                        {error && <div className="mb-4 text-red-500">{error}</div>}

                        <button
                            type="submit"
                            className="w-auto space-x-[100px] flex items-center justify-between py-2 px-4 bg-black text-white rounded-md hover:bg-[#000000d5] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="mr-2">{will_install ? 'Install' : 'Login'}</span>
                            <Image src={InstallIcon} alt="Arrow Link" width={24} height={24} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
