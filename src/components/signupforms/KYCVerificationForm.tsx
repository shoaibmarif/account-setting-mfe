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

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = (props) => {
    return (
        <BaseKYCVerificationForm
            {...props}
            title={props.title ?? 'KYC for Existing user'}
            subtitle={props.subtitle ?? 'Enter your email and password to sign in!'}
            stepperSteps={props.stepperSteps ?? 5}
            stepperActiveStep={props.stepperActiveStep ?? 1}
            isForgotPassword={props.isForgotPassword ?? false}
            isDormantUser={props.isDormantUser ?? false}
            infoVariant={props.infoVariant ?? 'policy'}
            showCancelButton={props.showCancelButton ?? true}
            submitButtonText={props.submitButtonText ?? 'Verify & Continue'}
        />
    );
};

export default KYCVerificationForm;
