import { useCallback, useState } from 'react';
import { Button } from 'customMain/components';
import OTPRecoveryCodeHelp from './OTPRecoveryCodeHelp';
import PreferredMethodSelector from './PreferredMethodSelector';

interface OTPAuthenticationHelpProps {
    selectedMethod: string;
    onSelectMethod: (value: string) => void;
    preferredMethodError?: string;
    onContinue: () => void | Promise<void>;
    onRecoveryCodeContinue?: (recoveryCode: string) => void | Promise<void>;
}

const OTPAuthenticationHelp: React.FC<OTPAuthenticationHelpProps> = ({
    selectedMethod,
    onSelectMethod,
    preferredMethodError,
    onContinue,
    onRecoveryCodeContinue,
}) => {
    const [showRecoveryCodeView, setShowRecoveryCodeView] = useState(false);

    const handleRecoveryContinue = useCallback(
        async (recoveryCode: string) => {
            await onRecoveryCodeContinue?.(recoveryCode);
        },
        [onRecoveryCodeContinue],
    );

    if (showRecoveryCodeView) {
        return <OTPRecoveryCodeHelp onContinue={handleRecoveryContinue} />;
    }

    return (
        <div className="mt-6 px-4 py-4 space-y-4">
            <div className="text-center">
                <img
                    src={`${__webpack_public_path__}assets/images/authenticator-help-image.webp`}
                    alt="OTP help"
                    className="mx-auto h-24 w-24 object-contain"
                />
                <h4 className="mt-3 text-2xl font-bold text-primary">OTP Authentication Help!</h4>
                <p className="mt-1 text-[#9A9A9A] text-[12px] leading-4 px-3">
                    Choose an alternative method to access your account securely.
                </p>
            </div>

            <div className="h-px bg-[#D9D9D9] w-full" />

            <button
                type="button"
                className="w-full rounded-[4px] border border-[#C8CCE0] px-4 py-3 text-left transition-colors hover:bg-[#F8F9FD]"
                onClick={() => setShowRecoveryCodeView(true)}
            >
                <span className="flex items-start gap-2.5">
                    <img
                        src={`${__webpack_public_path__}assets/images/recovery-code-icon.webp`}
                        alt="Recovery code icon"
                        className="h-5 w-5 object-contain mt-0.5"
                    />
                    <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-primary leading-4">
                            Use Recovery Code
                        </span>
                        <span className="text-[11px] text-[#9A9A9A] leading-4">
                            Enter one of your recovery codes
                        </span>
                    </span>
                </span>
            </button>

            <div className="text-center">
                <span className="text-[#9A9A9A] text-xs">Or</span>
            </div>

            <PreferredMethodSelector
                selectedMethod={selectedMethod}
                onSelect={onSelectMethod}
                error={preferredMethodError || undefined}
            />

            <div className="pt-2">
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={onContinue}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default OTPAuthenticationHelp;
