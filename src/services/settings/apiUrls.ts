const baseURLkyc =
    globalThis._env_?.['REACT_HOST_APP_URL_KYC'] ||
    process.env['REACT_HOST_APP_URL_KYC'] ||
    'http://localhost:5231/api';

const AUTH_BASE = '/kyc/auth';

export const SETTINGS_API_URLS = {
    RECOVERY_CODES_REGENERATE: `${baseURLkyc}${AUTH_BASE}/mfa/recovery-codes/regenerate`,
};

