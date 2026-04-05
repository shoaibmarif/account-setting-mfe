import React, { useMemo } from 'react';

interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, length = 6 }) => {
    const inputIds = useMemo(
        () => Array.from({ length }, (_, index) => `otp-input-${index + 1}`),
        [length],
    );

    // Handler for pasting OTP
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('Text').replaceAll(/\D/g, '').slice(0, length);
        if (pasted.length) {
            onChange(pasted.padEnd(length, ''));
            e.preventDefault();
        }
    };
    
    const isDarkMode = () => {
        return globalThis.document.documentElement.dataset['theme'] === 'dark' ||
             globalThis.document.documentElement.classList.contains('dark') ||
               globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isDarkMode()) {
            e.currentTarget.style.borderColor = '#04ECB8';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(4, 236, 184, 0.3)';
        } else {
            e.currentTarget.style.borderColor = '#062E92';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(6, 46, 146, 0.1)';
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const dark = isDarkMode();
        e.currentTarget.style.borderColor = dark ? '#4A5568' : '#252955';
        e.currentTarget.style.boxShadow = '';
    };

    return (
        <div className="flex justify-center gap-3 px-4">
            {inputIds.map((inputId, index) => (
                <input
                    key={inputId}
                    type="text"
                    maxLength={1}
                    className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none transition-all`}
                    style={{ boxSizing: 'border-box' }}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                            const currentValue = value || '';
                            const newValue =
                                currentValue.substring(0, index) +
                                val +
                                currentValue.substring(index + 1);
                            onChange(newValue.substring(0, length));
                            if (val && index < length - 1) {
                                const nextInput = e.target.nextElementSibling as HTMLInputElement;
                                nextInput?.focus();
                            }
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
                            const prevInput = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                            prevInput?.focus();
                        }
                    }}
                    value={value?.[index] || ''}
                />
            ))}
        </div>
    );
};

export default OTPInput;
