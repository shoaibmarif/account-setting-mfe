import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from 'customMain/components';
import { showToast } from 'customMain/utils';
import Stepper from '../common/Stepper';
import { Modal } from '../common/Modal';
import PreferredMethodSelector from '../common/PreferredMethodSelector';
import RegisterDeviceCheckbox from '../common/RegisterDeviceCheckbox';
import { trustedDeviceSchema, type TrustedDeviceFormData } from '../../pages/validations';
import { shouldStopOnApiFailure } from '../../utils/helper';
import {
    type MfaSetupData,
} from '../../utils/mfaOtpHelper';
import {
    TRUSTED_DEVICE_CHECKBOX_HELPER_TEXT,
    TRUSTED_DEVICE_DEFAULT_ACTIVE_STEP,
    TRUSTED_DEVICE_DEFAULT_STEPPER_STEPS,
    TRUSTED_DEVICE_HEADER_DESCRIPTION,
    TRUSTED_DEVICE_HEADER_TITLE,
    TRUSTED_DEVICE_SECTION_DESCRIPTION,
    TRUSTED_DEVICE_SECTION_TITLE,
    TRUSTED_DEVICE_SUBMIT_TEXT,
    TRUSTED_DEVICE_SUCCESS_MODAL_IMAGE,
} from '../../utils/constants/trustedDevice.constants';
import {
    buildTrustedDeviceSubmissionPayload,
    getTrustedDeviceSubmitErrorMessage,
    type TrustedDeviceState,
} from '../../utils/trustedDeviceHelper';

interface TrustedDeviceFormProps {
    trustedDeviceData: TrustedDeviceState;
    setTrustedDeviceData: (v: TrustedDeviceState) => void;
    mfaData: MfaSetupData;
    onSubmitDevice: (payload: ReturnType<typeof buildTrustedDeviceSubmissionPayload>) => Promise<any>;
    successModalTitle: string;
    successModalDescription: string;
    successModalButtonText: string;
    onSuccessModalClose: () => void;
    stepperSteps?: number;
    stepperActiveStep?: number;
}

const TrustedDeviceForm: React.FC<TrustedDeviceFormProps> = ({
    trustedDeviceData,
    setTrustedDeviceData,
    mfaData,
    onSubmitDevice,
    successModalTitle,
    successModalDescription,
    successModalButtonText,
    onSuccessModalClose,
    stepperSteps = TRUSTED_DEVICE_DEFAULT_STEPPER_STEPS,
    stepperActiveStep = TRUSTED_DEVICE_DEFAULT_ACTIVE_STEP,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setError,
        setValue,
        watch,
    } = useForm<TrustedDeviceFormData>({
        defaultValues: {
            methodId: trustedDeviceData.methodId || '',
            registerDevice: trustedDeviceData.registerDevice,
        },
    });

    const selectedMethod = watch('methodId');

    const onFormSubmit = async (data: TrustedDeviceFormData) => {
        setSubmitError('');

        const parsed = trustedDeviceSchema.safeParse(data);
        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            if (firstIssue?.path?.[0] === 'methodId') {
                setError('methodId', {
                    type: 'manual',
                    message: firstIssue.message,
                });
            }
            return;
        }

        setIsLoading(true);
        try {
            const response = await onSubmitDevice(buildTrustedDeviceSubmissionPayload(data, mfaData));
            if (shouldStopOnApiFailure(response, showToast.error)) {
                return;
            }

            setTrustedDeviceData({
                methodId: data.methodId,
                registerDevice: data.registerDevice,
            });
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Trusted device submission failed:', error);
            setSubmitError(getTrustedDeviceSubmitErrorMessage());
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onSuccessModalClose();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-4">
                <div className="text-center px-2">
                    <h3 className="text-2xl font-bold text-primary">{TRUSTED_DEVICE_HEADER_TITLE}</h3>
                    <p className="text-[#9A9A9A] text-[12px]">{TRUSTED_DEVICE_HEADER_DESCRIPTION}</p>
                </div>

                <div className="flex justify-center pt-1">
                    <Stepper steps={stepperSteps} activeStep={stepperActiveStep} />
                </div>

                <div className="space-y-4 pt-1">
                    <PreferredMethodSelector
                        selectedMethod={selectedMethod}
                        onSelect={(value) => {
                            clearErrors('methodId');
                            setValue('methodId', value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }}
                        {...(errors['methodId']?.message
                            ? { error: errors['methodId']?.message }
                            : {})}
                    />

                    <div className="space-y-1">
                        <h4 className="text-center text-[25px] leading-8 font-semibold text-primary">
                            {TRUSTED_DEVICE_SECTION_TITLE}
                        </h4>
                        <p className="text-center text-[12px] text-[#9A9A9A] px-2">
                            {TRUSTED_DEVICE_SECTION_DESCRIPTION}
                        </p>
                    </div>

                    <div className="pt-1">
                        <Controller
                            name="registerDevice"
                            control={control}
                            render={({ field }) => (
                                <RegisterDeviceCheckbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                    helperText={TRUSTED_DEVICE_CHECKBOX_HELPER_TEXT}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="pt-6 flex justify-center">
                    <Button type="submit" variant="primary" size="md" loading={isLoading}>
                        {TRUSTED_DEVICE_SUBMIT_TEXT}
                    </Button>
                </div>
                {submitError && <p className="text-center text-red-500 text-xs">{submitError}</p>}
            </form>

            <Modal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                imageSrc={`${__webpack_public_path__}assets/images/${TRUSTED_DEVICE_SUCCESS_MODAL_IMAGE}`}
                title={successModalTitle}
                description={successModalDescription}
                buttonText={successModalButtonText}
            />
        </>
    );
};

export default TrustedDeviceForm;