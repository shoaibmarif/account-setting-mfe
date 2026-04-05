import apiService from 'customMain/api';
import { SETTINGS_API_URLS } from './apiUrls';
import type { ApiSuccessResponse, ApiErrorResponse } from 'customMain/api/api.service.types';

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export const authService = {
    regenerateRecoveryCodes: (data: { employeeId: string }) =>
        apiService.post<ApiResponse<any>>(SETTINGS_API_URLS.RECOVERY_CODES_REGENERATE, data),
};
