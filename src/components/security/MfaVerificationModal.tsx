import React, { useState } from 'react';
import { Modal } from 'customMain/components';

interface MfaVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => Promise<void>;
    isLoading: boolean;
}

export const MfaVerificationModal: React.FC<MfaVerificationModalProps> = ({
    isOpen,
    onClose,

    isLoading,
}) => {
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    // const handleVerify = async () => {
    //     const normalizedCode = otpCode.trim();
    //     if (!/^\d{6}$/.test(normalizedCode)) {
    //         setError('Enter a valid 6-digit MFA code.');
    //         return;
    //     }

    //     try {
    //         setError(null);
    //         await onVerified();
    //         setOtpCode('');
    //     } catch {
    //         setError('MFA verification failed. Please try again.');
    //     }
    // };

    const handleClose = () => {
        if (isLoading) {
            return;
        }
        setOtpCode('');
        setError(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Verify Multi-Factor Authentication"
            size="sm"
            footer={
                <div className="w-full flex justify-center pb-2">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-lg text-[16px] transition-all bg-[#252A56] text-white "
                    >
                        Cancel setup
                    </button>
                </div>
            }
        >
            <div className="p-4 space-y-6">
                <p className="text-[14px] text-[#667085] leading-relaxed font-medium">
                    For security, enter your 6-digit authenticator code before regenerating recovery
                    codes.
                </p>

                <div className="space-y-4">
                    <input
                        value={otpCode}
                        onChange={(e) => {
                            const digitsOnly = e.target.value
                                .split('')
                                .filter((char) => /\d/.test(char))
                                .join('')
                                .slice(0, 6);
                            setOtpCode(digitsOnly);
                            if (error) setError(null);
                        }}
                        inputMode="numeric"
                        placeholder="Enter 6-digit code"
                        className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[16px] text-[#111827] focus:ring-1 focus:ring-[#1570EF] focus:border-[#1570EF] transition-all"
                    />

                    {error && (
                        <p className="text-[13px] text-red-600 font-bold">
                            ⚠️ {error}
                        </p>
                    )}
                </div>


            </div>
        </Modal>
    );
};
