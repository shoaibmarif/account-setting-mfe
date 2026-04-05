import SharedTrustedDeviceForm from '../forms/TrustedDeviceForm';
import { authService } from '../../services/auth.service';
import { APP_ROUTES } from '../../routes/pathUrl';

const REGISTER_TRUSTED_DEVICE_MODAL_TITLE = 'User onboarded successfully';
const REGISTER_TRUSTED_DEVICE_MODAL_DESCRIPTION =
    'You have successfully logged in to your account. Redirecting you to the dashboard.';
const REGISTER_TRUSTED_DEVICE_MODAL_BUTTON_TEXT = 'Ok';

interface TrustedDeviceFormProps {
    trustedDeviceData: {
        methodId: string;
        registerDevice: boolean;
    };
    setTrustedDeviceData: (v: { methodId: string; registerDevice: boolean }) => void;
    kycData: {
        employeeId: string;
        cnic: string;
        email: string;
        mobileNo: string;
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
            successModalTitle={REGISTER_TRUSTED_DEVICE_MODAL_TITLE}
            successModalDescription={REGISTER_TRUSTED_DEVICE_MODAL_DESCRIPTION}
            successModalButtonText={REGISTER_TRUSTED_DEVICE_MODAL_BUTTON_TEXT}
            onSuccessModalClose={() => {
                globalThis.location.href = APP_ROUTES.AUTH_LOGIN_URL;
            }}
            onSubmitDevice={(payload) =>
                authService.newUserRegisterOnBoarded({
                    employeeId: kycData?.employeeId,
                    cnic: kycData?.cnic,
                    email: kycData?.email,
                    mobileNo: kycData?.mobileNo,
                    methodId: payload.methodId,
                    isRegisterDevice: payload.registerDevice,
                    deviceId: payload.deviceId,
                    isTemporaryPassword: true,
                    authenticatorEnabled: true,
                    isMigrated: false,
                    authenticatorSecret: payload.authenticatorSecret,
                    isCMSUser: false,
                })
            }
        />
    );
};

export default TrustedDeviceForm;
