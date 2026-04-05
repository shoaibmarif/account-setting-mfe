import React from 'react';
import SharedMFAOTPForm from '../forms/MFAOTPForm';
import { MFAOTPFormData } from '../../pages/validations';

interface MFAOTPFormProps {
    mfaOTPData: MFAOTPFormData;
    setMfaOTPData: (v: MFAOTPFormData) => void;
    onCancel: () => void;
    onConfirm?: () => void;
    mobileNo?: string;
    employeeId?: string;
    mfaData: {
        manualKey: string;
        qrCodeImageBase64: string;
    };
}

const MFAOTPForm: React.FC<MFAOTPFormProps> = (props) => {
    return <SharedMFAOTPForm {...props} showSuccessModal successModalImage="mfa-verified.webp" />;
};

export default MFAOTPForm;
