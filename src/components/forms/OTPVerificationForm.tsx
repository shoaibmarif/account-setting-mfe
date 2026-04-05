import { memo, useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import { authService } from '../../services/auth.service';
import { otpVerificationSchema, type OTPVerificationFormData } from '../../pages/validations';
import { OTPInput } from '../common/OTPInput';
import OTPAuthenticationHelp from '../common/OTPAuthenticationHelp';
import CountdownTimer from '../common/CountdownTimer';
import Modal from '../common/Modal';
import Stepper from '../common/Stepper';
import { shouldStopOnApiFailure } from '../../utils/helper';
import {
    OTP_DEFAULT_ACTIVE_STEP,
    OTP_DEFAULT_SECONDARY_ACTION_TEXT,
    OTP_DEFAULT_STEPPER_STEPS,
    OTP_DEFAULT_SUCCESS_MODAL_DESCRIPTION,
    OTP_DEFAULT_SUCCESS_MODAL_IMAGE,
    OTP_DEFAULT_SUCCESS_MODAL_TITLE,
    OTP_IMAGE,
    OTP_OR_TEXT,
    OTP_PREFERRED_METHOD_REQUIRED_TEXT,
    OTP_RESEND_CTA,
    OTP_RESEND_PROMPT,
    OTP_SUBMIT_TEXT,
    OTP_TITLE,
} from '../../utils/constants/otpVerification.constants';
import {
    type OtpCodeState,
    type OtpPostVerificationAction,
    resolveOtpCodeState,
    resolveOtpKycData,
    resolveOtpMethodId,
} from '../../utils/otpVerificationHelper';

interface OTPVerificationFormProps {
    otpVerificationData: OtpCodeState;
    setOtpVerificationData: (v: OtpCodeState) => void;
    mobileNo?: string;
    setStep?: (step?: string) => void;
    setKycData?: (v: any) => void;
    resolveKycData?: (responsePayload: any) => any;
    showResendOption?: boolean;
    secondaryActionText?: string;
    onSecondaryAction?: () => void;
    stepperSteps?: number;
    stepperActiveStep?: number;
    showSuccessModal?: boolean;
    successModalTitle?: string;
    successModalDescription?: string;
    successModalImage?: string;
    onSuccessModalClose?: () => void | Promise<void>;
    onPostVerificationAction?: OtpPostVerificationAction;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = memo(
    ({
        otpVerificationData,
        setOtpVerificationData,
        mobileNo,
        setStep,
        setKycData,
        resolveKycData,
        showResendOption = true,
        secondaryActionText = OTP_DEFAULT_SECONDARY_ACTION_TEXT,
        onSecondaryAction,
        stepperSteps = OTP_DEFAULT_STEPPER_STEPS,
        stepperActiveStep = OTP_DEFAULT_ACTIVE_STEP,
        showSuccessModal = false,
        successModalTitle = OTP_DEFAULT_SUCCESS_MODAL_TITLE,
        successModalDescription = OTP_DEFAULT_SUCCESS_MODAL_DESCRIPTION,
        successModalImage = OTP_DEFAULT_SUCCESS_MODAL_IMAGE,
        onSuccessModalClose,
        onPostVerificationAction,
    }) => {
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isOpen, setIsOpen] = useState(false);
        const [showOtpHelp, setShowOtpHelp] = useState(false);
        const [selectedMethod, setSelectedMethod] = useState('');
        const [preferredMethodError, setPreferredMethodError] = useState('');

        const {
            control,
            handleSubmit: handleFormSubmit,
            formState: { errors },
        } = useZodForm({
            schema: otpVerificationSchema,
            defaultValues: otpVerificationData,
        });

        const handleOtpSubmit = useCallback(
            async (data: OTPVerificationFormData) => {
                setIsSubmitting(true);
                try {
                    if (mobileNo) {
                        const verifyOtpResponse = await authService.verifyOTPMobile({
                            mobileNo,
                            otp: data['otpCode'],
                        });

                        if (shouldStopOnApiFailure(verifyOtpResponse, showToast.error)) {
                            return;
                        }

                        const responsePayload = verifyOtpResponse?.data?.payload;
                        setKycData?.(
                            resolveKycData
                                ? resolveKycData(responsePayload)
                                : resolveOtpKycData(responsePayload),
                        );

                        setStep?.(verifyOtpResponse?.data?.redirectStep);
                    }

                    setOtpVerificationData(resolveOtpCodeState(data));

                    const shouldContinue = await onPostVerificationAction?.({
                        source: 'otp',
                        otpCode: data['otpCode'] || '',
                    });
                    if (shouldContinue === false) {
                        return;
                    }

                    if (showSuccessModal) {
                        setIsOpen(true);
                        return;
                    }
                } finally {
                    setIsSubmitting(false);
                }
            },
            [
                mobileNo,
                onPostVerificationAction,
                resolveKycData,
                setKycData,
                setOtpVerificationData,
                setStep,
                showSuccessModal,
            ],
        );

        const handleResendOtp = useCallback(async () => {
            if (!mobileNo) return;
            try {
                const resendOtpResponse = await authService.resendOTPMobile({ mobileNo });
                shouldStopOnApiFailure(resendOtpResponse, showToast.error);
            } catch (_error) {
                console.error('OTP resend error:', _error);
            }
        }, [mobileNo]);

        const handleModalClose = useCallback(async () => {
            try {
                await onSuccessModalClose?.();
            } finally {
                setIsOpen(false);
            }
        }, [onSuccessModalClose]);

        const handleSecondaryActionClick = useCallback(() => {
            setShowOtpHelp(true);
        }, []);

        const handleOtpHelpContinue = useCallback(async () => {
            if (!selectedMethod) {
                setPreferredMethodError(OTP_PREFERRED_METHOD_REQUIRED_TEXT);
                return;
            }

            setPreferredMethodError('');
            const shouldContinue = await onPostVerificationAction?.({
                source: 'preferredMethod',
                methodId: resolveOtpMethodId(selectedMethod),
            });
            if (shouldContinue === false) {
                return;
            }
            onSecondaryAction?.();
        }, [onPostVerificationAction, onSecondaryAction, selectedMethod]);

        const handleRecoveryCodeContinue = useCallback(
            async (recoveryCode: string) => {
                const shouldContinue = await onPostVerificationAction?.({
                    source: 'recoveryCode',
                    recoveryCode,
                });
                if (shouldContinue === false) {
                    return;
                }
                onSecondaryAction?.();
            },
            [onPostVerificationAction, onSecondaryAction],
        );

        return (
            <>
                {showOtpHelp ? (
                    <OTPAuthenticationHelp
                        selectedMethod={selectedMethod}
                        onSelectMethod={(value) => {
                            setSelectedMethod(value);
                            setPreferredMethodError('');
                        }}
                        preferredMethodError={preferredMethodError}
                        onContinue={handleOtpHelpContinue}
                        onRecoveryCodeContinue={handleRecoveryCodeContinue}
                    />
                ) : (
                    <form onSubmit={handleFormSubmit(handleOtpSubmit)} className="space-y-4">
                        <div className="text-center py-6">
                            <img
                                src={`${__webpack_public_path__}assets/images/${OTP_IMAGE}`}
                                alt="OTP verification"
                                className="w-25 h-25 mx-auto"
                            />
                            <h3 className="text-2xl font-semibold text-primary dark:text-white mt-6">
                                {OTP_TITLE}
                            </h3>
                            <p className="text-[#9A9A9A] text-sm">
                                Enter the verification code sent via SMS to
                                {mobileNo ? (
                                    <span className="text-[#252955] font-bold">{mobileNo}</span>
                                ) : null}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Stepper steps={stepperSteps} activeStep={stepperActiveStep} />
                        </div>

                        <p className="text-center text-primary text-sm font-medium mb-2">
                            <CountdownTimer seconds={120} />
                        </p>

                        <Controller
                            name="otpCode"
                            control={control}
                            render={({ field }) => (
                                <OTPInput
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors['otpCode']?.message}
                                    length={6}
                                />
                            )}
                        />
                        {errors['otpCode'] && (
                            <p className="text-red-500 text-sm text-center">
                                {errors['otpCode'].message}
                            </p>
                        )}

                        <div className="flex justify-center gap-4 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                testId="otp-submit"
                                loading={isSubmitting}
                                className="w-full"
                            >
                                {OTP_SUBMIT_TEXT}
                            </Button>
                        </div>

                        {showResendOption ? (
                            <div className="text-center mt-6">
                                <p className="text-[#9A9A9A] text-sm">
                                    {OTP_RESEND_PROMPT}{' '}
                                    <button
                                        type="button"
                                        className="text-[#252955] dark:text-[#04ECB8] font-bold cursor-pointer"
                                        onClick={handleResendOtp}
                                    >
                                        {OTP_RESEND_CTA}
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4 text-center">
                                <p className="text-[#252955] text-sm font-medium">{OTP_OR_TEXT}</p>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleSecondaryActionClick}
                                >
                                    {secondaryActionText}
                                </Button>
                            </div>
                        )}
                    </form>
                )}

                {showSuccessModal && (
                    <Modal
                        isOpen={isOpen}
                        onClose={handleModalClose}
                        imageSrc={`${__webpack_public_path__}assets/images/${successModalImage}`}
                        title={successModalTitle}
                        description={successModalDescription}
                    />
                )}
            </>
        );
    },
);

OTPVerificationForm.displayName = 'OTPVerificationForm';

export default OTPVerificationForm;
