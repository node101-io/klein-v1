import React, { useState } from 'react';
import Image from 'next/image';


import Input from '@/components/common/input';
import InstallIcon from '@/assets/icons/install-icon.svg';
import Tooltip from '@/components/common/Tooltip';
import HelpIcon from '@/assets/icons/help.svg';
const EditValidator = () => {
    const [inputs, setInputs] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
        input7: '',
        input8: '',
        input9: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full h-full overflow-auto">
            <div className="flex gap-x-4 items-center mb-8">
                <h1 className="text-xl font-light">Edit Validator</h1>
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Input
                        key={`input${index + 1}`}
                        label={`Label ${index + 1}`}
                        name={`input${index + 1}`}
                        value={inputs[`input${index + 1}`]}
                        onChange={handleInputChange}
                        helperText={`Helper text for input ${index + 1}`}
                    />
                ))}
            </div>
            <div className="mb-4 w-full xl:w-3/4">
                <Input
                    label="Input 9"
                    name="input9"
                    value={inputs.input9}
                    onChange={handleInputChange}
                    helperText="Helper text for input 9"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="w-auto flex items-center justify-between py-2 px-4 bg-black text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span className="mr-20">Save</span>
                    <Image src={InstallIcon} alt="Arrow Link" width={24} height={24} />
                </button>
            </div>
        </form>
    );
};

export default EditValidator;
