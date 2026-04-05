import SharedTrustedDeviceForm from '../forms/TrustedDeviceForm';
import { authService } from '../../services/auth.service';
import { APP_ROUTES } from '../../routes/pathUrl';

const SIGNUP_TRUSTED_DEVICE_MODAL_TITLE = 'KYC successfully Performed';
const SIGNUP_TRUSTED_DEVICE_MODAL_DESCRIPTION =
    'You have successfully logged in to your account. Redirecting you to the dashboard.';
const SIGNUP_TRUSTED_DEVICE_MODAL_BUTTON_TEXT = 'Ok';

interface TrustedDeviceFormProps {
    trustedDeviceData: {
        methodId: string;
        registerDevice: boolean;
    };
    setTrustedDeviceData: (v: { methodId: string; registerDevice: boolean }) => void;
    kycData: {
        employeeId: string;
        cnic: string;
        userName: string;
        mobileNo: string;
        newPassword: string;
    };
    mfaData: { manualKey: string; qrCodeImageBase64: string };
}

const TrustedDeviceForm: React.FC<TrustedDeviceFormProps> = ({
    trustedDeviceData,
    setTrustedDeviceData,
    kycData,
    mfaData,
}) => {
    return (
        <SharedTrustedDeviceForm
            trustedDeviceData={trustedDeviceData}
            setTrustedDeviceData={setTrustedDeviceData}
            mfaData={mfaData}
            successModalTitle={SIGNUP_TRUSTED_DEVICE_MODAL_TITLE}
            successModalDescription={SIGNUP_TRUSTED_DEVICE_MODAL_DESCRIPTION}
            successModalButtonText={SIGNUP_TRUSTED_DEVICE_MODAL_BUTTON_TEXT}
            onSuccessModalClose={() => {
                globalThis.location.href = APP_ROUTES.PROTECTED_DASHBOARD;
            }}
            onSubmitDevice={(payload) =>
                authService.internalUserOnBoarded({
                    employeeId: kycData?.employeeId,
                    cnic: kycData?.cnic,
                    username: kycData?.userName,
                    password: kycData?.newPassword,
                    mobileNo: kycData?.mobileNo,
                    methodId: payload.methodId,
                    isRegisterDevice: payload.registerDevice,
                    deviceId: payload.deviceId,
                    isMigrated: true,
                    authenticatorEnabled: true,
                    authenticatorSecret: payload.authenticatorSecret,
                })
            }
        />
    );
};

export default TrustedDeviceForm;
