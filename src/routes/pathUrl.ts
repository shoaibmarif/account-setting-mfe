const AUTH_BASE_URL =
    globalThis._env_?.['REACT_AUTH_BASE_URL'] ||
    process.env['REACT_AUTH_BASE_URL'] ||
    'http://localhost:9000';

const AUTH_LOGIN_PATH = '/auth/login';

export const APP_ROUTES = {
    ROOT: '/',
    AUTH_LOGIN_PATH,
    AUTH_LOGIN_URL: `${AUTH_BASE_URL}${AUTH_LOGIN_PATH}`,
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password', // NOSONAR - route path, not credential
    DORMANT_USER_KYC: '/dormant-user-kyc',
    PASSWORD_RESET: '/password-reset', // NOSONAR - route path, not credential
    PROTECTED_DASHBOARD: '/weboc2/user-management/dashboard',
    NOT_FOUND: '*',
};
