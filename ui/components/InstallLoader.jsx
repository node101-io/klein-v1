import React, { useState, useEffect } from 'react';

const InstallLoader = ({ totalSteps = 100, onComplete, cancelled = false }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (cancelled) {
            return;
        }

        const totalDuration = Math.random() * 5000 + 1000;
        const intervalDuration = totalDuration / totalSteps;

        const interval = setInterval(() => {
            setCurrentStep((prevStep) => {
                if (prevStep < totalSteps) {
                    return prevStep + 1;
                } else {
                    clearInterval(interval);
                    return prevStep;
                }
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [totalSteps, cancelled]);

    useEffect(() => {
        if (currentStep === totalSteps && onComplete) {
            onComplete();
        }
    }, [currentStep, totalSteps, onComplete]);

    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="flex flex-col justify-center h-full w-full">
            <div className="flex justify-between mb-2">
                <span className={`text-lg ${cancelled ? 'text-red-500' : 'text-text_gray'}`}>
                    {cancelled ? 'Installation Cancelled' : 'Installing'}
                </span>
                {!cancelled && (
                    <span className="text-lg text-text_gray">{percentage}%</span>
                )}
            </div>
            <div className="flex justify-between items-center w-full">
                {[...Array(totalSteps)].map((_, index) => (
                    <svg
                        key={index}
                        width="6"
                        height="8"
                        viewBox="0 0 6 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-colors duration-300 ${cancelled
                            ? 'text-red-500'
                            : index < currentStep
                                ? 'text-blue-500'
                                : 'text-gray-300'
                            }`}
                    >
                        <path
                            d="M2.08118 8L4.96817 4.32551H5.90902V3.49922H4.96817L2.11984 0H0.90189L4.16265 3.98748L4.16909 3.73083L0.818115 8H2.08118Z"
                            fill="currentColor"
                        />
                    </svg>
                ))}
            </div>
        </div>
    );
};

export default InstallLoader;
