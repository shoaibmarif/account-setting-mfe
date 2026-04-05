import React, { useEffect } from 'react';
import Stepper from '../common/Stepper';
import { authService } from '../../services/settings/auth.service';
import { Button } from 'customMain/components';
import type { MfaSetupData } from '../../utils/mfaOtpHelper';
import {
    MFA_ENROLLMENT_DEFAULT_ACTIVE_STEP,
    MFA_ENROLLMENT_DEFAULT_STEPPER_STEPS,
    MFA_ENROLLMENT_HEADER_DESCRIPTION,
    MFA_ENROLLMENT_HEADER_TITLE,
    MFA_ENROLLMENT_INSTRUCTIONS,
    MFA_ENROLLMENT_INSTRUCTIONS_TITLE,
    MFA_ENROLLMENT_NEXT_BUTTON_CLASS_NAME,
    MFA_ENROLLMENT_NEXT_BUTTON_TEXT,
    MFA_ENROLLMENT_QR_ERROR_TEXT,
    MFA_ENROLLMENT_QR_IMAGE_CLASS_NAME,
    MFA_ENROLLMENT_QR_WRAPPER_CLASS_NAME,
} from '../../utils/constants/mfaEnrollment.constants';
import {
    extractMfaEnrollmentPayload,
    type MfaEnrollmentResponse,
    resolveMfaSetupData,
} from '../../utils/mfaEnrollmentHelper';

interface MFAEnrollmentFormProps {
    employeeId: string;
    mfaData: MfaSetupData;
    setMfaData: React.Dispatch<React.SetStateAction<MfaSetupData>>;
    onSuccess?: () => void;
    stepperSteps?: number;
    stepperActiveStep?: number;
}

const MFAEnrollmentForm: React.FC<MFAEnrollmentFormProps> = ({
    employeeId,
    mfaData,
    setMfaData,
    onSuccess,
    stepperSteps = MFA_ENROLLMENT_DEFAULT_STEPPER_STEPS,
    stepperActiveStep = MFA_ENROLLMENT_DEFAULT_ACTIVE_STEP,
}) => {
    useEffect(() => {
        const enrollMFA = async () => {
            if (!employeeId?.trim()) {
                return;
            }

            try {
                const response: MfaEnrollmentResponse = await authService.mfaAuthenticatorSetup({
                    employeeId,
                });
                setMfaData(resolveMfaSetupData(extractMfaEnrollmentPayload(response)));
            } catch (error) {
                console.error('Failed to generate MFA QR:', error);
            }
        };

        enrollMFA();
    }, [employeeId, setMfaData]);

    return (
        <form className="w-full">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary">{MFA_ENROLLMENT_HEADER_TITLE}</h3>
                <p className="text-[#9A9A9A] text-sm">{MFA_ENROLLMENT_HEADER_DESCRIPTION}</p>
            </div>

            <div className="flex justify-center mb-6">
                <Stepper steps={stepperSteps} activeStep={stepperActiveStep} />
            </div>

            <div className="text-center py-8">
                {mfaData.qrCodeImageBase64 ? (
                    <div className={MFA_ENROLLMENT_QR_WRAPPER_CLASS_NAME}>
                        <img
                            src={`data:image/png;base64,${mfaData.qrCodeImageBase64}`}
                            alt="MFA QR Code"
                            className={MFA_ENROLLMENT_QR_IMAGE_CLASS_NAME}
                        />
                    </div>
                ) : (
                    <div className="text-red-500">{MFA_ENROLLMENT_QR_ERROR_TEXT}</div>
                )}

                <div className="mx-auto mt-6 w-full text-left space-y-4">
                    <h2 className="text-md font-semibold text-primary">
                        {MFA_ENROLLMENT_INSTRUCTIONS_TITLE}
                    </h2>
                    {MFA_ENROLLMENT_INSTRUCTIONS.map((instruction, index) => (
                        <div key={instruction.title} className="flex items-start gap-2">
                            <span className="text-sm font-semibold text-primary">{index + 1}.</span>
                            <div>
                                <h4 className="text-sm font-semibold text-primary">
                                    {instruction.title}
                                </h4>
                                <p className="text-[#9A9A9A] text-sm">{instruction.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-6">
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => onSuccess?.()}
                        className={MFA_ENROLLMENT_NEXT_BUTTON_CLASS_NAME}
                    >
                        {MFA_ENROLLMENT_NEXT_BUTTON_TEXT}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default MFAEnrollmentForm;
