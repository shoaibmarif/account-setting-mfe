export const MFA_ENROLLMENT_DEFAULT_STEPPER_STEPS = 5;
export const MFA_ENROLLMENT_DEFAULT_ACTIVE_STEP = 3;
export const MFA_ENROLLMENT_HEADER_TITLE = 'Multi-Factor Authentication Setup';
export const MFA_ENROLLMENT_HEADER_DESCRIPTION =
    'Secure your account with third-party authenticator';
export const MFA_ENROLLMENT_QR_ERROR_TEXT = 'Failed to generate QR code';
export const MFA_ENROLLMENT_INSTRUCTIONS_TITLE = 'Instructions';
export const MFA_ENROLLMENT_NEXT_BUTTON_TEXT = 'Next';

export const MFA_ENROLLMENT_INSTRUCTIONS = [
    {
        title: 'Add Authenticator App',
        description: 'Install an authenticator app and tap "+" to add an account.',
    },
    {
        title: 'Scan QR Code',
        description: 'Use your phone to scan the QR code on this screen.',
    },
    {
        title: 'Verify OTP',
        description: 'Enter the 6-digit code from the app and click "Next".',
    },
] as const;

export const MFA_ENROLLMENT_QR_WRAPPER_CLASS_NAME =
    'inline-flex items-center justify-center rounded-lg p-3 border border-[#D9D9D9]';

export const MFA_ENROLLMENT_QR_IMAGE_CLASS_NAME = 'w-32 h-32';

export const MFA_ENROLLMENT_NEXT_BUTTON_CLASS_NAME = 'w-1/2';