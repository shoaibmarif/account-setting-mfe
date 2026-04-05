import { memo, useCallback, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import { authService } from '../../services/auth.service';
import { kycVerificationSchema, type KYCVerificationFormData } from '../../pages/validations';
import Stepper from '../common/Stepper';
import InfoTooltip from '../common/InfoTooltip';
import { APP_ROUTES } from '../../routes/pathUrl';
import { shouldStopOnApiFailure } from '../../utils/helper';
import {
    type InfoVariant,
    KYC_FORM_FIELDS,
} from '../../utils/constants/kycVerification.constants';
import {
    buildInternalUserKycPayload,
    buildKycVerificationPayload,
    getFieldIcon,
    getTooltipContentIcon,
    getTooltipText,
    type KycApiResponse,
    resolveKycResponseData,
} from '../../utils/kycVerificationHelper';

interface KYCVerificationFormProps {
    kycData: KYCVerificationFormData;
    setKycData: (v: KYCVerificationFormData) => void;
    setStep?: (step?: string) => void;
    onCancel?: () => void;
    onSubmit?: (data: KYCVerificationFormData) => Promise<void>;
    title?: string;
    subtitle?: string;
    stepperSteps?: number;
    stepperActiveStep?: number;
    isForgotPassword?: boolean;
    isDormantUser?: boolean;
    infoVariant?: InfoVariant;
    showCancelButton?: boolean;
    submitButtonText?: string;
}

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = memo(
    ({
        kycData,
        setKycData,
        setStep,
        onCancel,
        onSubmit: customOnSubmit,
        title = 'KYC Verification',
        subtitle = 'Please verify your identity to proceed',
        stepperSteps = 5,
        stepperActiveStep = 1,
        isForgotPassword = false,
        isDormantUser = false,
        infoVariant = 'policy',
        showCancelButton = true,
        submitButtonText = 'Verify & Continue',
    }) => {
        const navigate = useNavigate();
        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
            setValue,
        } = useZodForm({
            schema: kycVerificationSchema,
            defaultValues: kycData,
        });

        useEffect(() => {
            if (isForgotPassword || isDormantUser) {
                return;
            }

            let isMounted = true;

            const hydrateKeycloakIdentity = async () => {
                try {
                    const identityResponse = await authService.getKeycloakIdentity();

                    if (shouldStopOnApiFailure(identityResponse, showToast.error)) {
                        return;
                    }

                    const identityPayload =
                        identityResponse?.data?.payload ?? identityResponse?.data ?? {};

                    const resolvedUserName =
                        identityPayload?.userName ??
                        identityPayload?.username ??
                        identityPayload?.preferred_username ??
                        kycData.userName;

                    const resolvedEmployeeId =
                        identityPayload?.employeeId ??
                        identityPayload?.employeeID ??
                        kycData.employeeId;

                    if (!isMounted) {
                        return;
                    }

                    if (
                        resolvedUserName === kycData.userName &&
                        resolvedEmployeeId === kycData.employeeId
                    ) {
                        return;
                    }

                    setKycData({
                        ...kycData,
                        userName: resolvedUserName,
                        employeeId: resolvedEmployeeId,
                    });

                    setValue('userName', resolvedUserName);
                    setValue('employeeId', resolvedEmployeeId);
                } catch (error) {
                    console.error('Failed to load keycloak identity:', error);
                }
            };

            hydrateKeycloakIdentity();

            return () => {
                isMounted = false;
            };
        }, [
            isDormantUser,
            isForgotPassword,
            kycData,
            setKycData,
            setValue,
            shouldStopOnApiFailure,
        ]);

        const handleCancel = useCallback(() => {
            if (onCancel) {
                onCancel();
                return;
            }
            navigate(APP_ROUTES.ROOT);
        }, [onCancel, navigate]);

        const handleKycSubmit = useCallback(
            async (data: KYCVerificationFormData) => {
                try {
                    // Use custom submit if provided
                    if (customOnSubmit) {
                        await customOnSubmit(data);
                        return;
                    }

                    // Select API based on scenario
                    const payload = buildKycVerificationPayload(data, {
                        isForgotPassword,
                        isDormantUser,
                    });
                    let kycResponse: KycApiResponse;

                    if (isForgotPassword) {
                        kycResponse = await authService.forgotPasswordKYC(payload);
                    } else if (isDormantUser) {
                        kycResponse = await authService.dormantUserKYC(payload);
                    } else {
                        kycResponse = await authService.internalUserSignupKYCVerification(
                            buildInternalUserKycPayload(data),
                        );
                    }

                    if (shouldStopOnApiFailure(kycResponse, showToast.error)) {
                        return;
                    }

                    const responsePayload = kycResponse?.data?.payload;
                    const resolvedKycData = resolveKycResponseData(responsePayload, data);

                    setKycData(resolvedKycData);

                    const redirectStep = kycResponse?.data?.redirectStep;
                    setStep?.(redirectStep);

                    if (redirectStep !== 'otp') {
                        return;
                    }

                    const otpResponse = await authService.sendOTPMobile({
                        mobileNo: resolvedKycData.mobileNo,
                    });

                    if (shouldStopOnApiFailure(otpResponse, showToast.error)) {
                        return;
                    }
                } catch (error) {
                    console.error('KYC submission error:', error);
                }
            },
            [
                customOnSubmit,
                isDormantUser,
                isForgotPassword,
                setKycData,
                setStep,
                shouldStopOnApiFailure,
            ],
        );

        return (
            <form onSubmit={handleSubmit(handleKycSubmit)} className="w-full px-4 py-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary dark:text-white">{title}</h3>
                    <p className="text-[#9A9A9A] text-sm mb-6">{subtitle}</p>
                    <div className="flex justify-center">
                        <Stepper steps={stepperSteps} activeStep={stepperActiveStep} />
                    </div>
                </div>

                <div className="space-y-4">
                    {KYC_FORM_FIELDS.map((field) => {
                        const tooltipText = getTooltipText(
                            field.name as keyof KYCVerificationFormData,
                            infoVariant as InfoVariant,
                        );
                        const tooltipContentIcon = getTooltipContentIcon(
                            field.name as keyof KYCVerificationFormData,
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
                                    name={field.name as keyof KYCVerificationFormData}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <TextInput
                                            {...controllerField}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            error={
                                                errors[field.name as keyof KYCVerificationFormData]
                                                    ?.message
                                            }
                                            prefixIcon={getFieldIcon(field.icon)}
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        />
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex gap-3">
                    {showCancelButton && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={handleCancel}
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        size={showCancelButton ? 'md' : 'lg'}
                        loading={isSubmitting}
                        className="w-full"
                    >
                        {submitButtonText}
                    </Button>
                </div>
            </form>
        );
    },
);

KYCVerificationForm.displayName = 'KYCVerificationForm';
export default KYCVerificationForm;
