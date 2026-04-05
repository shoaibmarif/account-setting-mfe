import type React from 'react';
import type { PasswordResetFormData } from '../pages/validations';
import { InfoCircleIcon, LockIcon, UserIcon } from '../components/icons/FormIcons';
import {
    KYC_FIELD_ICON_CLASS_NAME,
    TEMP_DEVICE_ID,
} from './constants/kycVerification.constants';
import {
    PASSWORD_RESET_FORM_FIELDS,
    PASSWORD_RESET_PASSWORD_POLICY_TEXT,
} from './constants/passwordReset.constants';

export const getPasswordResetFieldIcon = (
    icon: (typeof PASSWORD_RESET_FORM_FIELDS)[number]['icon'],
) => {
    switch (icon) {
        case 'user':
            return <UserIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'password':
            return <LockIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        default:
            return null;
    }
};

export const getPasswordResetTooltipText = (
    fieldName: keyof PasswordResetFormData,
): string | null => {
    if (fieldName === 'newPassword' || fieldName === 'confirmPassword') {
        return PASSWORD_RESET_PASSWORD_POLICY_TEXT;
    }

    return null;
};

export const getPasswordResetTooltipContentIcon = (
    fieldName: keyof PasswordResetFormData,
): React.ReactNode => {
    if (fieldName === 'newPassword' || fieldName === 'confirmPassword') {
        return <InfoCircleIcon className="h-5 w-5" />;
    }

    return null;
};

export const buildPasswordResetPayload = (data: PasswordResetFormData) => ({
    userName: data.userName,
    newPassword: data.newPassword,
    deviceId: TEMP_DEVICE_ID,
});
