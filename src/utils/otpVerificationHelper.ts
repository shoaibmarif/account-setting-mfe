import type { OTPVerificationFormData } from '../pages/validations';

export type OtpSource = 'otp' | 'recoveryCode' | 'preferredMethod';

export interface OtpPostVerificationActionData {
    source: OtpSource;
    methodId?: number;
    recoveryCode?: string;
    otpCode?: string;
}

export type OtpPostVerificationAction = (
    data: OtpPostVerificationActionData,
) => boolean | void | Promise<boolean | void>;

export interface OtpCodeState {
    otpCode: string;
}

export interface OtpResolvedKycData {
    employeeId: string;
    cnic: string;
    mobileNo: string;
    email: string;
}

export const resolveOtpCodeState = (data: OTPVerificationFormData): OtpCodeState => ({
    otpCode: data.otpCode || '',
});

export const resolveOtpMethodId = (selectedMethod: string): number => {
    const methodId = Number(selectedMethod);
    return Number.isNaN(methodId) ? 0 : methodId;
};

export const resolveOtpKycData = (responsePayload: any): OtpResolvedKycData => ({
    email: responsePayload?.email,
    employeeId: responsePayload?.employeeId,
    cnic: responsePayload?.cnic,
    mobileNo: responsePayload?.mobileNo,
});