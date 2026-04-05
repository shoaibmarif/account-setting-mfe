export const PASSWORD_RESET_FORM_FIELDS = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'User Name',
        icon: 'user',
        type: 'text',
    },
    {
        name: 'newPassword',
        label: 'Create New Password',
        placeholder: 'Min. 8 Characters',
        icon: 'password',
        type: 'password',
    },
    {
        name: 'confirmPassword',
        label: 'Re-type Password',
        placeholder: 'Min. 8 Characters',
        icon: 'password',
        type: 'password',
    },
] as const;

export const PASSWORD_RESET_STEPPER_STEPS = 3;

export const PASSWORD_RESET_STEPPER_ACTIVE_STEP = 1;

export { KYC_PASSWORD_POLICY_TEXT as PASSWORD_RESET_PASSWORD_POLICY_TEXT } from './kycVerification.constants';
