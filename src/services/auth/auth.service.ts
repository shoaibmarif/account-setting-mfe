import apiService from 'customMain/api';
import { SETTINGS_API_URLS } from './apiUrls';
import type { ApiSuccessResponse, ApiErrorResponse } from 'customMain/api/api.service.types';

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface EmployeeIdQuery {
    employeeId: string;
}

export interface VerifyRecoveryCodeRequest {
    employeeId: string;
    recoveryCode: string;
}

export const authService = {
    getRecoveryCodes: (employeeId: string) =>
        apiService.get<ApiResponse<any>>(SETTINGS_API_URLS.GET_RECOVERY_CODES, {
            params: { employeeId },
        }),

    getCurrentRecoveryCodes: (employeeId: string) =>
        apiService.get<ApiResponse<any>>(SETTINGS_API_URLS.GET_CURRENT_RECOVERY_CODES, {
            params: { employeeId },
        }),

    getCurrentRecoveryCodesPlain: (employeeId: string) =>
        apiService.get<ApiResponse<any>>(SETTINGS_API_URLS.GET_CURRENT_RECOVERY_CODES_PLAIN, {
            params: { employeeId },
        }),

    issueRecoveryCodes: (data: EmployeeIdQuery) =>
        apiService.post<ApiResponse<any>>(SETTINGS_API_URLS.RECOVERY_CODES_ISSUE, data),

    regenerateRecoveryCodes: (data: { employeeId: string }) =>
        apiService.post<ApiResponse<any>>(SETTINGS_API_URLS.RECOVERY_CODES_REGENERATE, data),

    verifyRecoveryCode: (data: VerifyRecoveryCodeRequest) =>
        apiService.post<ApiResponse<any>>(SETTINGS_API_URLS.VERIFY_RECOVERY_CODE, data),
};
