export type InfoVariant = 'policy' | 'mobileHint' | 'both' | 'none';

export const TEMP_DEVICE_ID = `dev_${Math.random().toString(36).substring(2, 10)}`;

export const KYC_FIELD_ICON_CLASS_NAME = 'h-5 w-5 text-[#062E92] dark:text-[#04ECB8]';

export const INFO_TOOLTIP_TRIGGER_CLASS_NAME = 'inline-flex h-6 w-6 items-center justify-center';

export const INFO_TOOLTIP_BORDER = '1px solid #F2F4FF';

export const INFO_TOOLTIP_STYLE = {
    backgroundColor: '#F2F4FF',
    borderRadius: '4px',
    padding: '10px 14px',
    maxWidth: '460px',
    boxShadow: '0 2px 6px rgba(37,41,85,0.06)',
    zIndex: 9999,
} as const;

export const KYC_FORM_FIELDS = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'User Name',
        icon: 'user',
        type: 'text',
    },
    {
        name: 'employeeId',
        label: 'Employee ID',
        placeholder: 'Employee ID',
        icon: 'user',
        type: 'text',
    },
    {
        name: 'cnic',
        label: 'CNIC Number',
        placeholder: 'CNIC Number',
        icon: 'cnic',
        type: 'text',
    },
    {
        name: 'mobileNo',
        label: 'Mobile Number',
        placeholder: 'Mobile Number',
        icon: 'phone',
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

export const KYC_MOBILE_HINT_TEXT = 'Enter Mobile Number Registered with FBR HRMS';

export const KYC_PASSWORD_POLICY_TEXT =
    'Password policy: minimum 8 characters, including uppercase letter, lowercase letter, number, and symbol. HRMS is the source of truth; discrepancies are auto-synchronized from HRMS.'; // NOSONAR - UI help text, not a credential

export const REGISTER_KYC_FORM_FIELDS = [
    {
        name: 'employeeId',
        label: 'Employee ID',
        placeholder: 'Employee ID',
        icon: 'cnic',
        type: 'text',
    },
    {
        name: 'email',
        label: 'Email Address',
        placeholder: 'Email Address',
        icon: 'email',
        type: 'email',
    },
    {
        name: 'cnic',
        label: 'CNIC Number',
        placeholder: 'CNIC Number',
        icon: 'cnic',
        type: 'text',
    },
    {
        name: 'mobileNo',
        label: 'Mobile Number',
        placeholder: 'Mobile Number',
        icon: 'phone',
        type: 'text',
    },
] as const;