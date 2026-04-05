import React from 'react';
import BaseOTPVerificationForm from '../forms/OTPVerificationForm';
import type { OtpCodeState } from '../../utils/otpVerificationHelper';

interface OTPVerificationFormProps {
    otpVerificationData: OtpCodeState;
    setOtpVerificationData: (v: OtpCodeState) => void;
    mobileNo?: string;
    setStep?: (step?: string) => void;
    setKycData?: (v: { employeeId: string; cnic: string; mobileNo: string; email: string }) => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
    otpVerificationData,
    setOtpVerificationData,
    mobileNo,
    setStep,
    setKycData,
}) => {
    return (
        <BaseOTPVerificationForm
            otpVerificationData={otpVerificationData}
            setOtpVerificationData={setOtpVerificationData}
            mobileNo={mobileNo}
            setStep={setStep}
            stepperSteps={5}
            stepperActiveStep={2}
            setKycData={setKycData}
        />
    );
};

export default OTPVerificationForm;
