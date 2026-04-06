const baseURLkyc =
    globalThis._env_?.['REACT_HOST_APP_URL_KYC'] ||
    process.env['REACT_HOST_APP_URL_KYC'] ||
    'http://localhost:5231/api';

const AUTH_BASE = '/kyc/auth';

export const SETTINGS_API_URLS = {
    GET_RECOVERY_CODES: `${baseURLkyc}${AUTH_BASE}/mfa/recovery-codes`,
    GET_CURRENT_RECOVERY_CODES: `${baseURLkyc}${AUTH_BASE}/mfa/current-recovery-codes`,
    GET_CURRENT_RECOVERY_CODES_PLAIN: `${baseURLkyc}${AUTH_BASE}/mfa/current-recovery-codes/plain`,
    RECOVERY_CODES_ISSUE: `${baseURLkyc}${AUTH_BASE}/mfa/recovery-codes/issue`,
    RECOVERY_CODES_REGENERATE: `${baseURLkyc}${AUTH_BASE}/mfa/recovery-codes/regenerate`,
    VERIFY_RECOVERY_CODE: `${baseURLkyc}${AUTH_BASE}/verify-recovery-code`,
};

