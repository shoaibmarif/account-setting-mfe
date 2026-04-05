import type React from 'react';
import type { KYCVerificationFormData } from '../pages/validations';
import {
    EmailIcon,
    IdCardIcon,
    InfoCircleIcon,
    LockIcon,
    PhoneIcon,
    UserIcon,
} from '../components/icons/FormIcons';
import {
    type InfoVariant,
    KYC_FIELD_ICON_CLASS_NAME,
    KYC_FORM_FIELDS,
    KYC_MOBILE_HINT_TEXT,
    KYC_PASSWORD_POLICY_TEXT,
    REGISTER_KYC_FORM_FIELDS,
} from './constants/kycVerification.constants';

export interface KycResponsePayload {
    userName?: string;
    username?: string;
    employeeId?: string;
    employeeID?: string;
    cnic?: string;
    cnicNumber?: string;
    mobileNo?: string;
    mobileNumber?: string;
}

export interface KycApiResponse {
    data?: {
        payload?: KycResponsePayload;
        redirectStep?: string;
        success?: boolean;
    };
    success?: boolean;
    message?: string;
    status?: unknown;
}

export interface RegisterKycResponsePayload {
    employeeId?: string;
    cnic?: string;
    mobileNo?: string;
    email?: string;
}

export interface RegisterKycApiResponse {
    data?: {
        payload?: RegisterKycResponsePayload;
        redirectStep?: string;
        success?: boolean;
    };
    success?: boolean;
    message?: string;
    status?: unknown;
}

export const getFieldIcon = (icon: (typeof KYC_FORM_FIELDS)[number]['icon']) => {
    switch (icon) {
        case 'user':
            return <UserIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'cnic':
            return <IdCardIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'phone':
            return <PhoneIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'password':
            return <LockIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        default:
            return null;
    }
};

export const buildKycVerificationPayload = (
    data: KYCVerificationFormData,
    flags: { isForgotPassword: boolean; isDormantUser: boolean },
) => ({
    employeeID: data.employeeId,
    cnicNumber: data.cnic,
    mobileNumber: data.mobileNo,
    username: data.userName,
    password: data.newPassword,
    isForgotPassword: flags.isForgotPassword,
    isDormantUser: flags.isDormantUser,
});

export const buildInternalUserKycPayload = (data: KYCVerificationFormData) => ({
    userName: data.userName,
    password: data.newPassword,
    employeeID: data.employeeId,
    cnicNumber: data.cnic,
    mobileNumber: data.mobileNo,
    isForgotPassword: false,
    isDormantUser: false,
});

export const getTooltipText = (
    fieldName: keyof KYCVerificationFormData,
    infoVariant: InfoVariant,
): string | null => {
    if (fieldName === 'mobileNo' && (infoVariant === 'mobileHint' || infoVariant === 'both')) {
        return KYC_MOBILE_HINT_TEXT;
    }

    if (
        (fieldName === 'newPassword' || fieldName === 'confirmPassword') &&
        (infoVariant === 'policy' || infoVariant === 'both')
    ) {
        return KYC_PASSWORD_POLICY_TEXT;
    }

    return null;
};

export const getTooltipContentIcon = (
    fieldName: keyof KYCVerificationFormData,
): React.ReactNode => {
    if (fieldName === 'newPassword' || fieldName === 'confirmPassword') {
        return <InfoCircleIcon className="h-5 w-5" />;
    }

    return null;
};

export const resolveKycResponseData = (
    responsePayload: KycResponsePayload | undefined,
    data: KYCVerificationFormData,
): KYCVerificationFormData => ({
    userName: responsePayload?.userName ?? responsePayload?.username ?? data.userName,
    employeeId: responsePayload?.employeeId ?? responsePayload?.employeeID ?? data.employeeId,
    cnic: responsePayload?.cnic ?? responsePayload?.cnicNumber ?? data.cnic,
    mobileNo: responsePayload?.mobileNo ?? responsePayload?.mobileNumber ?? data.mobileNo,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
});

export const getRegisterFieldIcon = (icon: (typeof REGISTER_KYC_FORM_FIELDS)[number]['icon']) => {
    switch (icon) {
        case 'cnic':
            return <IdCardIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'email':
            return <EmailIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        case 'phone':
            return <PhoneIcon className={KYC_FIELD_ICON_CLASS_NAME} />;
        default:
            return null;
    }
};

export const buildRegisterKycVerificationPayload = (data: {
    employeeId: string;
    cnic: string;
    mobileNo: string;
    email: string;
}) => ({
    employeeId: data.employeeId,
    cnic: data.cnic,
    mobileNumber: data.mobileNo,
    email: data.email,
});

export const getRegisterTooltipText = (fieldName: string): string | null => {
    if (fieldName === 'mobileNo') {
        return KYC_MOBILE_HINT_TEXT;
    }

    return null;
};

export const resolveRegisterKycResponseData = (
    responsePayload: RegisterKycResponsePayload | undefined,
) => ({
    email: responsePayload?.email ?? '',
    employeeId: responsePayload?.employeeId ?? '',
    cnic: responsePayload?.cnic ?? '',
    mobileNo: responsePayload?.mobileNo ?? '',
});