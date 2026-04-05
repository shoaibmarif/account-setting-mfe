import { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import { otpRecoveryCodeSchema, type OTPRecoveryCodeFormData } from '../../pages/validations';
import { authService } from '../../services/auth.service';
import { isSuccessfulResponse, shouldShowLocalError } from '../../utils/helper';
import Stepper from './Stepper';

interface OTPRecoveryCodeHelpProps {
    initialRecoveryCode?: string;
    onContinue: (recoveryCode: string) => void;
}

const OTPRecoveryCodeHelp: React.FC<OTPRecoveryCodeHelpProps> = ({
    initialRecoveryCode = '',
    onContinue,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useZodForm({
        schema: otpRecoveryCodeSchema,
        defaultValues: {
            recoveryCode: initialRecoveryCode,
        },
    });

    const handleRecoveryCodeSubmit = useCallback(
        async (data: OTPRecoveryCodeFormData) => {
            try {
                const response = await authService.recoveryCodeAPI({
                    recoveryCode: data.recoveryCode,
                });

                if (!isSuccessfulResponse(response)) {
                    if (shouldShowLocalError(response)) {
                        showToast.error(response?.message);
                    }
                    return;
                }
                showToast.success(response?.message || 'Recovery code verified successfully');
            } catch (error) {
                console.error('Recovery code verification error:', error);
                return;
            }
            onContinue(data.recoveryCode);
        },
        [onContinue],
    );

    return (
        <form
            onSubmit={handleSubmit(handleRecoveryCodeSubmit)}
            className="mt-8 px-6 py-6 space-y-8"
        >
            <div className="text-center">
                <img
                    src={`${__webpack_public_path__}assets/images/authenticator-help-image.webp`}
                    alt="Recovery code help"
                    className="mx-auto h-24 w-24 object-contain"
                />
                <h4 className="text-3xl font-semibold text-primary mt-4">Use Recovery Code</h4>
            </div>

            <div className="flex justify-center">
                <Stepper steps={4} activeStep={2} />
            </div>

            <div className="space-y-3 mt-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <label
                        htmlFor="recoveryCode"
                        className="block text-primary text-sm font-semibold"
                    >
                        Recovery code{' '}
                        <span className="text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                </div>
                <Controller
                    name="recoveryCode"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            id="recoveryCode"
                            type="text"
                            placeholder="Enter Recovery code"
                            error={errors['recoveryCode']?.message}
                            prefixIcon={
                                <img
                                    src={`${__webpack_public_path__}assets/images/recovery-code-icon.webp`}
                                    alt="Recovery code icon"
                                    className="w-4 h-4 opacity-70"
                                />
                            }
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    )}
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4"
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                Continue
            </Button>
        </form>
    );
};

export default OTPRecoveryCodeHelp;
