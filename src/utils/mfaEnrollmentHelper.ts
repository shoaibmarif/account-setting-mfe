import type { MfaSetupData } from './mfaOtpHelper';

export interface MfaEnrollmentResponsePayload {
    manualKey?: string;
    qrCodeImageBase64?: string;
}

export interface MfaEnrollmentResponse {
    data?: {
        data?: MfaEnrollmentResponsePayload;
        manualKey?: string;
        qrCodeImageBase64?: string;
    };
    manualKey?: string;
    qrCodeImageBase64?: string;
}

export const extractMfaEnrollmentPayload = (
    response: MfaEnrollmentResponse,
): MfaEnrollmentResponsePayload => response?.data?.data || response?.data || response || {};

export const resolveMfaSetupData = (
    payload: MfaEnrollmentResponsePayload,
): MfaSetupData => ({
    manualKey: payload.manualKey || '',
    qrCodeImageBase64: payload.qrCodeImageBase64 || '',
});