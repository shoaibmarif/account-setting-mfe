import { memo, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import { authService } from '../../services/auth.service';
import {
    type KYCVerificationFormData,
    registerKycVerificationSchema,
    type RegisterKYCFormData,
} from '../../pages/validations';
import Stepper from '../common/Stepper';
import InfoTooltip from '../common/InfoTooltip';
import { APP_ROUTES } from '../../routes/pathUrl';
import { shouldStopOnApiFailure } from '../../utils/helper';
import { REGISTER_KYC_FORM_FIELDS } from '../../utils/constants/kycVerification.constants';
import {
    buildRegisterKycVerificationPayload,
    getRegisterFieldIcon,
    getRegisterTooltipText,
    type RegisterKycApiResponse,
    resolveRegisterKycResponseData,
} from '../../utils/kycVerificationHelper';

interface KYCVerificationFormProps {
    kycData: KYCVerificationFormData;
    setKycData: (v: KYCVerificationFormData) => void;
    setStep?: (step?: string) => void;
    title?: string;
    subtitle?: string;
    stepperSteps?: number;
    stepperActiveStep?: number;
}

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = memo(
    ({
        kycData,
        setKycData,
        setStep,
        title = 'Create Account',
        subtitle = 'Register to access Pakistan Customs Web Portal',
        stepperSteps = 5,
        stepperActiveStep = 1,
    }) => {
        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useZodForm({
            schema: registerKycVerificationSchema,
            defaultValues: {
                employeeId: kycData.employeeId,
                cnic: kycData.cnic,
                mobileNo: kycData.mobileNo,
                email: kycData.email,
            },
        });

        const handleKycSubmit = useCallback(
            async (data: RegisterKYCFormData) => {
                try {
                    const kycResponse: RegisterKycApiResponse =
                        await authService.newUserRegisterKYCVerification(
                            buildRegisterKycVerificationPayload(data),
                        );

                    if (shouldStopOnApiFailure(kycResponse, showToast.error)) {
                        return;
                    }

                    const responsePayload = kycResponse?.data?.payload;
                    setKycData(resolveRegisterKycResponseData(responsePayload));

                    const redirectStep = kycResponse?.data?.redirectStep;
                    setStep?.(redirectStep);

                    if (redirectStep !== 'otp') {
                        return;
                    }

                    const otpResponse = await authService.sendOTPMobile({
                        mobileNo: data.mobileNo,
                    });

                    if (shouldStopOnApiFailure(otpResponse, showToast.error)) {
                        return;
                    }
                } catch (error) {
                    console.error('KYC submission error:', error);
                }
            },
            [setKycData, setStep],
        );

        const handleSignIn = () => {
            globalThis.location.href = APP_ROUTES.AUTH_LOGIN_URL;
        };

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
                    {REGISTER_KYC_FORM_FIELDS.map((field) => {
                        const tooltipText = getRegisterTooltipText(
                            field.name as keyof RegisterKYCFormData,
                        );

                        return (
                            <div key={field.name}>
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <label className="block text-primary text-sm font-semibold">
                                        {field.label}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    {tooltipText && (
                                        <InfoTooltip text={tooltipText} />
                                    )}
                                </div>
                                <Controller
                                    name={field.name as keyof RegisterKYCFormData}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <TextInput
                                            {...controllerField}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            error={
                                                errors[field.name as keyof RegisterKYCFormData]
                                                    ?.message
                                            }
                                            prefixIcon={getRegisterFieldIcon(field.icon)}
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        />
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-center">
                    <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
                        Verify Identity & Continue
                    </Button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-[#9A9A9A] text-sm">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="text-[#252955] dark:text-[#04ECB8] font-bold cursor-pointer"
                            onClick={handleSignIn}
                        >
                            {' '}
                            Signin
                        </button>
                    </p>
                </div>
            </form>
        );
    },
);

KYCVerificationForm.displayName = 'KYCVerificationForm';
export default KYCVerificationForm;
