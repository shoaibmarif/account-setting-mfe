import React from 'react';
import BaseOTPVerificationForm from '../forms/OTPVerificationForm';
import type { OtpCodeState } from '../../utils/otpVerificationHelper';

interface OTPVerificationFormProps {
    otpVerificationData: OtpCodeState;
    setOtpVerificationData: (v: OtpCodeState) => void;
    kycData: {
        userName: string;
        employeeId: string;
        cnic: string;
        mobileNo: string;
        newPassword: string;
        confirmPassword: string;
    };
    setKycData: (v: {
        userName: string;
        employeeId: string;
        cnic: string;
        mobileNo: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
    setStep: (step?: string) => void;
    mobileNo?: string;
    onCancel: () => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
    otpVerificationData,
    setOtpVerificationData,
    kycData,
    setKycData,
    setStep,
    mobileNo,
    onCancel,
}) => {
    return (
        <BaseOTPVerificationForm
            otpVerificationData={otpVerificationData}
            setOtpVerificationData={setOtpVerificationData}
            setKycData={setKycData}
            setStep={setStep}
            resolveKycData={(responsePayload) => ({
                userName: responsePayload?.userName ?? responsePayload?.username ?? kycData.userName,
                employeeId: responsePayload?.employeeId ?? kycData.employeeId,
                cnic: responsePayload?.cnic ?? kycData.cnic,
                mobileNo: responsePayload?.mobileNo ?? kycData.mobileNo,
                newPassword: kycData.newPassword,
                confirmPassword: kycData.confirmPassword,
            })}
            mobileNo={mobileNo}
            onSecondaryAction={onCancel}
            stepperSteps={5}
            stepperActiveStep={2}
        />
    );
};

export default OTPVerificationForm;
