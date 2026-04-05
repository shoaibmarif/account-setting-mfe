import React from 'react';
import BaseOTPVerificationForm from '../forms/OTPVerificationForm';
import type {
    OtpCodeState,
    OtpPostVerificationAction,
} from '../../utils/otpVerificationHelper';

interface OTPVerificationFormProps {
    otpVerificationData: OtpCodeState;
    setOtpVerificationData: (v: OtpCodeState) => void;
    mobileNo?: string;
    onCancel: () => void;
    onPostVerificationAction?: OtpPostVerificationAction;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
    otpVerificationData,
    setOtpVerificationData,
    mobileNo,
    onCancel,
    onPostVerificationAction,
}) => {
    return (
        <BaseOTPVerificationForm
            otpVerificationData={otpVerificationData}
            setOtpVerificationData={setOtpVerificationData}
            mobileNo={mobileNo}
            showResendOption={false}
            onSecondaryAction={onCancel}
            secondaryActionText="Having Issue with OTP Authentication"
            stepperSteps={3}
            stepperActiveStep={2}
            onPostVerificationAction={onPostVerificationAction}
        />
    );
};

export default OTPVerificationForm;
