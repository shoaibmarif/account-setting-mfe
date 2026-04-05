import React, { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { mfaOtpFormSchema, MFAOTPFormData } from '../../pages/validations';
import { Button } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import Stepper from '../common/Stepper';
import OTPInput from '../common/OTPInput';
import Modal from '../common/Modal';
import { authService } from '../../services/settings/auth.service';
import { shouldStopOnApiFailure } from '../../utils/helper';
import {
    MFA_OTP_DEFAULT_ACTIVE_STEP,
    MFA_OTP_DEFAULT_HEADER_DESCRIPTION,
    MFA_OTP_DEFAULT_HEADER_TITLE,
    MFA_OTP_DEFAULT_ICON_IMAGE,
    MFA_OTP_DEFAULT_STEPPER_STEPS,
    MFA_OTP_DEFAULT_SUCCESS_MODAL_BUTTON_TEXT,
    MFA_OTP_DEFAULT_SUCCESS_MODAL_DESCRIPTION,
    MFA_OTP_DEFAULT_SUCCESS_MODAL_IMAGE,
    MFA_OTP_DEFAULT_SUCCESS_MODAL_TITLE,
} from '../../utils/constants/mfaOtp.constants';
import {
    buildVerifyMfaPayload,
    getMfaVerificationErrorMessage,
    type MfaSetupData,
    type MfaVerifyResponse,
} from '../../utils/mfaOtpHelper';

interface MFAOTPFormProps {
    mfaOTPData: MFAOTPFormData;
    setMfaOTPData: (v: MFAOTPFormData) => void;
    onCancel: () => void;
    onConfirm?: () => void;
    employeeId?: string;
    mfaData: MfaSetupData;
    stepperSteps?: number;
    stepperActiveStep?: number;
    showSuccessModal?: boolean;
    successModalTitle?: string;
    successModalDescription?: string;
    successModalImage?: string;
    successModalButtonText?: string;
}

const MFAOTPForm: React.FC<MFAOTPFormProps> = ({
    mfaOTPData,
    setMfaOTPData,
    onCancel,
    onConfirm,
    employeeId,
    mfaData,
    stepperSteps = MFA_OTP_DEFAULT_STEPPER_STEPS,
    stepperActiveStep = MFA_OTP_DEFAULT_ACTIVE_STEP,
    showSuccessModal = false,
    successModalTitle = MFA_OTP_DEFAULT_SUCCESS_MODAL_TITLE,
    successModalDescription = MFA_OTP_DEFAULT_SUCCESS_MODAL_DESCRIPTION,
    successModalImage = MFA_OTP_DEFAULT_SUCCESS_MODAL_IMAGE,
    successModalButtonText = MFA_OTP_DEFAULT_SUCCESS_MODAL_BUTTON_TEXT,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = useZodForm({
        schema: mfaOtpFormSchema,
        defaultValues: mfaOTPData,
    });

    const handleSuccessModalClose = useCallback(() => {
        setIsSuccessModalOpen(false);
        (onConfirm ?? onCancel)();
    }, [onCancel, onConfirm]);

    const handleVerifySubmit = useCallback(
        async (data: MFAOTPFormData) => {
            if (isSubmitting) return;

            setIsSubmitting(true);
            try {
                setMfaOTPData(data);
                const response: MfaVerifyResponse = await authService.verifyMfaAuthenticatorSetup(
                    buildVerifyMfaPayload(data, employeeId, mfaData.manualKey),
                );

                if (shouldStopOnApiFailure(response, showToast.error)) {
                    return;
                }

                if (showSuccessModal) {
                    setIsSuccessModalOpen(true);
                } else {
                    onConfirm?.();
                }
            } catch (error) {
                showToast.error(getMfaVerificationErrorMessage(error));
            } finally {
                setIsSubmitting(false);
            }
        },
        [isSubmitting, employeeId, mfaData.manualKey, setMfaOTPData, showSuccessModal, onConfirm],
    );

    return (
        <>
            <form onSubmit={handleFormSubmit(handleVerifySubmit)} className="w-full">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">{MFA_OTP_DEFAULT_HEADER_TITLE}</h3>
                    <p className="text-[#9A9A9A] text-sm">{MFA_OTP_DEFAULT_HEADER_DESCRIPTION}</p>
                </div>

                <div className="flex justify-center mb-6">
                    <Stepper steps={stepperSteps} activeStep={stepperActiveStep} />
                </div>

                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src={`${__webpack_public_path__}assets/images/${MFA_OTP_DEFAULT_ICON_IMAGE}`}
                            alt="MFA Icon"
                            className="w-26 h-26 object-contain"
                        />
                    </div>
                    <p className="text-[#9A9A9A] text-sm">Enter the code we sent on Authenticator App</p>
                </div>

                <div className="mb-6">
                    <Controller
                        name="otpCode"
                        control={control}
                        render={({ field }) => (
                            <OTPInput
                                value={field.value || ''}
                                onChange={field.onChange}
                                error={errors.otpCode?.message}
                                length={6}
                            />
                        )}
                    />
                    {errors.otpCode && (
                        <p className="text-red-500 text-sm text-center mt-2">
                            {errors.otpCode.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-center pt-4">
                    <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
                        Verify
                    </Button>
                </div>
            </form>

            {showSuccessModal && (
                <Modal
                    isOpen={isSuccessModalOpen}
                    onClose={handleSuccessModalClose}
                    imageSrc={`${__webpack_public_path__}assets/images/${successModalImage}`}
                    title={successModalTitle}
                    description={successModalDescription}
                    buttonText={successModalButtonText}
                />
            )}
        </>
    );
};

export default MFAOTPForm;
