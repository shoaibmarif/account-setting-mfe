import type { MFAOTPFormData } from '../pages/validations';
import type { KycApiResponse } from './kycVerificationHelper';
import {
    MFA_OTP_DEFAULT_VERIFY_DESCRIPTION,
} from './constants/mfaOtp.constants';

export interface MfaSetupData {
    manualKey: string;
    qrCodeImageBase64: string;
}

export const hasRequiredMfaSetupDetails = (employeeId?: string, manualKey?: string) =>
    Boolean(employeeId && manualKey);

export const buildVerifyMfaPayload = (
    data: MFAOTPFormData,
    employeeId: string,
    manualKey: string,
) => ({
    code: data.otpCode,
    employeeId,
    manualKey,
});

export const getMfaOtpDescription = (mobileNo?: string) =>
    mobileNo ? `${MFA_OTP_DEFAULT_VERIFY_DESCRIPTION} for ${mobileNo}` : MFA_OTP_DEFAULT_VERIFY_DESCRIPTION;

export const getMfaVerificationErrorMessage = (error: unknown) =>
    error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Failed to verify MFA code';

export type MfaVerifyResponse = KycApiResponse;