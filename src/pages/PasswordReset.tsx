import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { authService } from '../services/settings/auth.service';
import { passwordResetSchema, type PasswordResetFormData } from './validations';
import Stepper from '../components/common/Stepper';
import Modal from '../components/common/Modal';
import InfoTooltip from '../components/common/InfoTooltip';
import { AuthLayout } from '../components/layout';
import { APP_ROUTES } from '../routes/pathUrl';
import {
    PASSWORD_RESET_FORM_FIELDS,
    PASSWORD_RESET_STEPPER_ACTIVE_STEP,
    PASSWORD_RESET_STEPPER_STEPS,
} from '../utils/constants/passwordReset.constants';
import {
    buildPasswordResetPayload,
    getPasswordResetFieldIcon,
    getPasswordResetTooltipContentIcon,
    getPasswordResetTooltipText,
} from '../utils/passwordResetHelper';

const PasswordReset: React.FC = () => {
    const [submitError, setSubmitError] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useZodForm<PasswordResetFormData>({
        schema: passwordResetSchema,
        defaultValues: {
            userName: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: PasswordResetFormData) => {
        setSubmitError('');
        try {
            await authService.passwordReset(buildPasswordResetPayload(data));
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error('Password reset failed:', error);
            setSubmitError('Unable to reset password right now. Please try again.');
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 py-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Password Reset</h3>
                    <p className="text-[#9A9A9A] text-sm mb-6">
                        You have logged in using a temporary password. Set a new password to
                        proceed.
                    </p>
                    <div className="flex justify-center">
                        <Stepper
                            steps={PASSWORD_RESET_STEPPER_STEPS}
                            activeStep={PASSWORD_RESET_STEPPER_ACTIVE_STEP}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {PASSWORD_RESET_FORM_FIELDS.map((field) => {
                        const tooltipText = getPasswordResetTooltipText(
                            field.name as keyof PasswordResetFormData,
                        );
                        const tooltipContentIcon = getPasswordResetTooltipContentIcon(
                            field.name as keyof PasswordResetFormData,
                        );

                        return (
                            <div key={field.name}>
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <label className="block text-primary text-sm font-semibold">
                                        {field.label}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    {tooltipText && (
                                        <InfoTooltip
                                            text={tooltipText}
                                            contentIcon={tooltipContentIcon || undefined}
                                        />
                                    )}
                                </div>
                                <Controller
                                    name={field.name as keyof PasswordResetFormData}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <TextInput
                                            {...controllerField}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            error={
                                                errors[field.name as keyof PasswordResetFormData]
                                                    ?.message
                                            }
                                            prefixIcon={getPasswordResetFieldIcon(field.icon)}
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        />
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>

                {submitError && (
                    <p className="mt-3 text-center text-red-500 text-xs">{submitError}</p>
                )}

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Update Password
                    </Button>
                </div>
            </form>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    globalThis.location.href = APP_ROUTES.AUTH_LOGIN_URL;
                }}
                imageSrc={`${__webpack_public_path__}assets/images/otp-verified.webp`}
                title="Password Updated Successfully"
                description="Your password has been updated successfully. Please use your new password the next time you log in and keep your login credentials secure."
                buttonText="Back to Login"
            />
        </AuthLayout>
    );
};

export default PasswordReset;
