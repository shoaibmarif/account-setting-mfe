import { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import {
    KYCVerificationForm,
    OTPVerificationForm,
    MFAEnrollmentForm,
    OTPDeliveryPreferenceForm,
    TrustedDeviceForm,
} from '../components/registerforms';

const RegisterForm: React.FC = () => {
    const [step, setStep] = useState<'kyc' | 'otp' | 'mfa' | 'otpMFA' | 'trusted'>('kyc');
    const [kycData, setKycData] = useState({
        employeeId: '',
        cnic: '',
        mobileNo: '',
        email: '',
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
                    mobileNo={kycData.mobileNo}
                    setStep={setStep}
                    setKycData={setKycData}
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
                    employeeId={kycData.employeeId}
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

export default RegisterForm;