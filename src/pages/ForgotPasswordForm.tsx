import { useCallback, useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import KYCVerificationForm from '../components/forgotpasswordforms/KYCVerificationForm';
import OTPVerificationForm from '../components/forgotpasswordforms/OTPVerificationForm';
import { Modal } from '../components/common/Modal';
import { authService } from '../services/auth.service';
import { showToast } from 'customMain/utils';
import { isSuccessfulResponse, shouldShowLocalError } from '../utils/helper';
import { APP_ROUTES } from '../routes/pathUrl';

const ForgotPasswordForm: React.FC = () => {
    const [step, setStep] = useState<'kyc' | 'otp'>('kyc');
    const [kycData, setKycData] = useState({
        userName: '',
        employeeId: '',
        cnic: '',
        mobileNo: '',
        newPassword: '',
        confirmPassword: '',
        recoveryCode: '',
    });
    const [otpVerificationData, setOtpVerificationData] = useState({ otpCode: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleForgotPasswordUpdated = useCallback(
        async (data: {
            source: 'otp' | 'recoveryCode' | 'preferredMethod';
            methodId?: number;
            recoveryCode?: string;
        }) => {
            const payload = {
                employeeID: kycData.employeeId,
                username: kycData.userName,
                cnicNumber: kycData.cnic,
                mobileNumber: kycData.mobileNo,
                password: kycData.newPassword,
                isForgotPassword: true,
                isDormantUser: false,
                methodId: data.methodId ?? 0,
                recoveryCode: data.recoveryCode ?? kycData.recoveryCode ?? '',
            };

            const response = await authService.forgotPasswordUpdated(payload);
            if (!isSuccessfulResponse(response)) {
                if (shouldShowLocalError(response)) {
                    showToast.error(response?.message);
                }
                return false;
            }

            if (data.recoveryCode) {
                setKycData((prev) => ({ ...prev, recoveryCode: data.recoveryCode || '' }));
            }

            setShowSuccessModal(true);
            return true;
        },
        [kycData],
    );

    return (
        <>
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
                    onCancel={() => setStep('kyc')}
                    onPostVerificationAction={handleForgotPasswordUpdated}
                />
            )}
        </AuthLayout>

        <Modal
            isOpen={showSuccessModal}
            onClose={() => {
                setShowSuccessModal(false);
                globalThis.location.href = APP_ROUTES.AUTH_LOGIN_URL;
            }}
            imageSrc={`${__webpack_public_path__}assets/images/otp-verified.webp`}
            title="Password Reset Successful"
            description="Your password has been successfully updated. You can now log in with your new password. Please keep it secure."
            buttonText="Back to Login"
        />
        </>
    );
};

export default ForgotPasswordForm;
