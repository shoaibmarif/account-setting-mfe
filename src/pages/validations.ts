import { z } from 'zod';

// ==================== LOCAL REGEX PATTERNS ====================
export const REGEX_PATTERNS = {
    employeeId: /^\d+$/,
    cnic: /^\d{5}-\d{7}-\d$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mobileNo: /^03\d{9}$/,
    otpCode: /^\d{6}$/,
    base32: /^[A-Z2-7]{32}$/,
} as const;

// ==================== LOCAL VALIDATION SCHEMAS ====================
const localValidations = {
    employeeId: z
        .string()
        .min(1, 'Employee ID is required')
        .max(20, 'Employee ID must not exceed 20 characters')
        .regex(REGEX_PATTERNS.employeeId, 'Employee ID can only contain numbers'),

    cnic: z
        .string()
        .min(1, 'CNIC is required')
        .regex(REGEX_PATTERNS.cnic, 'CNIC must be in format: 35202-1234567-1'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .regex(REGEX_PATTERNS.email, 'Please enter a valid email address'),

    mobileNo: z
        .string()
        .min(1, 'Mobile number is required')
        .regex(REGEX_PATTERNS.mobileNo, 'Mobile number must be in format: 03001234567'),

    otpCode: z
        .string()
        .min(1, 'OTP is required')
        .length(6, 'OTP must be exactly 6 digits')
        .regex(REGEX_PATTERNS.otpCode, 'OTP must contain only digits'),

    setupKey: z
        .string()
        .min(1, 'Setup key is required')
        .regex(REGEX_PATTERNS.base32, 'Setup key must be a valid Base32 string'),

    qrCode: z
        .string()
        .min(1, 'QR code URI is required')
        .startsWith('otpauth://totp/', 'Invalid QR code URI format'),
} as const;

// KYC Verification Schema
const userNameValidation = z
    .string()
    .min(1, 'User Name is required')
    .max(50, 'User Name must not exceed 50 characters');

const newPasswordValidation = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must not exceed 32 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol');

export const kycVerificationSchema = z
    .object({
        userName: userNameValidation,
        employeeId: localValidations.employeeId,
        cnic: localValidations.cnic,
        mobileNo: localValidations.mobileNo,
        newPassword: newPasswordValidation,
        confirmPassword: newPasswordValidation,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match with new password',
        path: ['confirmPassword'],
    });

export type KYCVerificationFormData = z.infer<typeof kycVerificationSchema>;

export const registerKycVerificationSchema = z.object({
    employeeId: localValidations.employeeId,
    cnic: localValidations.cnic,
    mobileNo: localValidations.mobileNo,
    email: localValidations.email,
});

export type RegisterKYCFormData = z.infer<typeof registerKycVerificationSchema>;

// OTP Verification Schema
export const otpVerificationSchema = z.object({
    otpCode: localValidations.otpCode,
});

export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;

export const mfaOtpFormSchema = z.object({
    otpCode: localValidations.otpCode,
});

export type MFAOTPFormData = z.infer<typeof mfaOtpFormSchema>;

export const otpRecoveryCodeSchema = z.object({
    recoveryCode: z.string().trim().min(1, 'Recovery code is required'),
});

export type OTPRecoveryCodeFormData = z.infer<typeof otpRecoveryCodeSchema>;

// Trusted Device Schema
export const trustedDeviceSchema = z.object({
    methodId: z.string().min(1, 'Please select a preferred method'),
    registerDevice: z.boolean(),
});

export type TrustedDeviceFormData = z.infer<typeof trustedDeviceSchema>;

export const passwordResetSchema = z
    .object({
        userName: userNameValidation,
        newPassword: newPasswordValidation,
        confirmPassword: newPasswordValidation,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match with new password',
        path: ['confirmPassword'],
    });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
