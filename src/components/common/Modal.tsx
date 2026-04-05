import React from 'react';
import { Button } from 'customMain/components';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    title: string;
    description: string;
    buttonText?: string;
    variant?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    imageSrc,
    title,
    description,
    buttonText = 'Ok',
    variant = 'primary',
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background overlay */}
            <button
                type="button"
                className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClose();
                    }
                }}
                aria-label="Close modal overlay"
            ></button>
            <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center z-10">
                <img
                    src={imageSrc}
                    alt="Modal Visual"
                    className="mx-auto mb-6 w-24 h-24 object-contain"
                />
                <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
                <p className="text-[#9A9A9A] text-sm mb-6">{description}</p>
                <Button
                    type="button"
                    variant={variant}
                    size="lg"
                    onClick={onClose}
                    className="w-full"
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default Modal;
