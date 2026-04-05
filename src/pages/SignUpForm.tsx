import { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import KYCVerificationForm from '../components/signupforms/KYCVerificationForm';
import OTPVerificationForm from '../components/signupforms/OTPVerificationForm';
import MFAEnrollmentForm from '../components/signupforms/MFAEnrollmentForm';
import OTPDeliveryPreferenceForm from '../components/signupforms/MFAOTPForm';
import TrustedDeviceForm from '../components/signupforms/TrustedDeviceForm';

interface SignUpFormProps {
    onNavigateToSignUp?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = () => {
    const [step, setStep] = useState<'kyc' | 'otp' | 'mfa' | 'otpMFA' | 'trusted'>('kyc');
    const [kycData, setKycData] = useState({
        userName: '',
        employeeId: '',
        cnic: '',
        mobileNo: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [otpVerificationData, setOtpVerificationData] = useState({ otpCode: '' });
    const [mfaOTPData, setMfaOTPData] = useState({
        otpCode: '',
    });
    const [trustedDeviceData, setTrustedDeviceData] = useState({
        methodId: '',
        registerDevice: false,
    });
    const [mfaData, setMFAData] = useState({
        manualKey: '',
        qrCodeImageBase64: '',
    });

    return (
        <AuthLayout>
            {step === 'kyc' && (
                <KYCVerificationForm
                    kycData={kycData}
                    setKycData={setKycData}
                    setStep={setStep}
                />
            )}

            {step === 'otp' && (
                <OTPVerificationForm
                    otpVerificationData={otpVerificationData}
                    setOtpVerificationData={setOtpVerificationData}
                    kycData={kycData}
                    setKycData={setKycData}
                    setStep={setStep}
                    mobileNo={kycData.mobileNo}
                    onCancel={() => setStep('kyc')}
                />
            )}

            {step === 'mfa' && (
                <MFAEnrollmentForm
                    employeeId={kycData.employeeId}
                    onSuccess={() => setStep('otpMFA')}
                    mfaData={mfaData}
                    setMfaData={setMFAData}
                />
            )}

            {step === 'otpMFA' && (
                <OTPDeliveryPreferenceForm
                    mfaOTPData={mfaOTPData}
                    setMfaOTPData={setMfaOTPData}
                    onCancel={() => setStep('mfa')}
                    mobileNo={kycData.mobileNo}
                    userName={kycData.userName}
                    mfaData={mfaData}
                    onConfirm={() => setStep('trusted')}
                />
            )}

            {step === 'trusted' && (
                <TrustedDeviceForm
                    trustedDeviceData={trustedDeviceData}
                    setTrustedDeviceData={setTrustedDeviceData}
                    kycData={kycData}
                    mfaData={mfaData}
                />
            )}
        </AuthLayout>
    );
};

export default SignUpForm;
