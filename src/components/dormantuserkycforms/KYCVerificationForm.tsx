import React from 'react';
import BaseKYCVerificationForm from '../forms/KYCVerificationForm';
import type { KYCVerificationFormData } from '../../pages/validations';
import type { InfoVariant } from '../../utils/constants/kycVerification.constants';

interface KYCVerificationFormProps {
    kycData: KYCVerificationFormData;
    setKycData: (v: KYCVerificationFormData) => void;
    setStep?: (step?: string) => void;
    onCancel?: () => void;
    title?: string;
    subtitle?: string;
    stepperSteps?: number;
    stepperActiveStep?: number;
    isForgotPassword?: boolean;
    isDormantUser?: boolean;
    infoVariant?: InfoVariant;
    showCancelButton?: boolean;
    submitButtonText?: string;
}

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = ({
    kycData,
    setKycData,
    setStep,
    onCancel,
    title,
    subtitle,
    stepperSteps,
    stepperActiveStep,
    isForgotPassword,
    isDormantUser,
    infoVariant,
    showCancelButton,
    submitButtonText,
}) => {
    return (
        <BaseKYCVerificationForm
            kycData={kycData}
            setKycData={setKycData}
            setStep={setStep}
            onCancel={onCancel}
            title={title ?? 'KYC Re-Validation (Dormant)'}
            subtitle={subtitle ?? 'Enter your email and password to sign in!'}
            stepperSteps={stepperSteps ?? 3}
            stepperActiveStep={stepperActiveStep ?? 1}
            isForgotPassword={isForgotPassword ?? false}
            isDormantUser={isDormantUser ?? true}
            infoVariant={infoVariant ?? 'both'}
            showCancelButton={showCancelButton ?? true}
            submitButtonText={submitButtonText ?? 'Verify & Continue'}
        />
    );
};

export default KYCVerificationForm;
