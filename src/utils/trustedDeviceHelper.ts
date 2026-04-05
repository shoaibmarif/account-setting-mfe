import type { TrustedDeviceFormData } from '../pages/validations';
import type { MfaSetupData } from './mfaOtpHelper';
import {
    TRUSTED_DEVICE_SUBMIT_ERROR_TEXT,
} from './constants/trustedDevice.constants';

export interface TrustedDeviceState {
    methodId: string;
    registerDevice: boolean;
}

export interface TrustedDeviceSubmissionPayload {
    methodId: number;
    registerDevice: boolean;
    deviceId: string;
    authenticatorSecret: string;
}

export const buildTrustedDeviceSubmissionPayload = (
    data: TrustedDeviceFormData,
    mfaData: MfaSetupData,
): TrustedDeviceSubmissionPayload => ({
    methodId: Number(data.methodId),
    registerDevice: data.registerDevice,
    deviceId: `dev_${Math.random().toString(36).substring(2, 10)}`,
    authenticatorSecret: mfaData.manualKey,
});

export const getTrustedDeviceSubmitErrorMessage = () => TRUSTED_DEVICE_SUBMIT_ERROR_TEXT;