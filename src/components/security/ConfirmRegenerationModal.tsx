import React from 'react';
import { Modal } from 'customMain/components';

interface ConfirmRegenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const ConfirmRegenerationModal: React.FC<ConfirmRegenerationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Regeneration"
            size="sm"
            footer={
                <div className="w-full flex justify-center pb-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-sm text-[#4B5563] hover:text-[#1F2937] hover:underline font-medium transition-colors"
                    >
                        Cancel setup
                    </button>
                </div>
            }
        >
            <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/10 mb-8 border border-red-100">
                    <span className="text-red-600 dark:text-red-400 text-3xl">⚠️</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#1D2939] dark:text-white mb-3">
                    Regenerate Codes?
                </h3>
                
                <p className="text-sm font-medium text-[#667085] dark:text-[#94A3B8] mb-10 leading-relaxed px-4">
                    Generating new recovery codes will immediately invalidate all of your previous codes. 
                </p>

                <div className="pt-2">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] rounded-lg text-white font-bold text-sm tracking-wide transition-all shadow-md disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Yes, Regenerate Codes'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
