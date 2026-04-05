import React from 'react';

interface StepperProps {
    steps: number;
    activeStep: number;
    className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep, className }) => {
    return (
        <div className={`flex gap-2 ${className || ''}`}>
            {Array.from({ length: steps }, (_, i) => i + 1).map((step) => (
                <div
                    key={step}
                    className={`h-1.5 w-16 md:h-2 md:w-24 rounded-full border ${step <= activeStep ? 'border-[#EAF0FF] dark:border-[#04ECB8] bg-[#252955] dark:bg-[#04ECB8]' : 'border-[#EAF0FF] dark:border-[#04ECB821] bg-[#EAF0FF] dark:bg-[#04ECB821]'}`}
                />
            ))}
        </div>
    );
};

export default Stepper;
