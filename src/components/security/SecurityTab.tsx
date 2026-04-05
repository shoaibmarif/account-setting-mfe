import React, { useState } from 'react';
import { useRecoveryCodes } from '../../hooks/useRecoveryCodes';
import { RecoveryCodesModal } from './RecoveryCodesModal';
import { MfaVerificationModal } from './MfaVerificationModal';

export const SecurityTab: React.FC = () => {
    const { slots, loading, error, generateCodes } = useRecoveryCodes();

    // Modal states
    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState<string[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#252955] dark:border-[#04ECB8]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                <p>Error loading recovery codes: {error}</p>
            </div>
        );
    }

    const totalSlots = slots.length;
    const usedSlots = slots.filter((s) => s.used).length;
    const remainingSlots = Math.max(totalSlots - usedSlots, 0);
    const utilizationPercent = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;

    const handleGenerateCodes = async () => {
        try {
            setIsGenerating(true);
            const newCodes = await generateCodes();
            setGeneratedCodes(newCodes);
        } catch {
            // Error is handled by the hook and shown in UI
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateRequest = () => {
        setIsMfaModalOpen(true);
    };

    const handleMfaVerified = async () => {
        try {
            setIsGenerating(true);
            const newCodes = await generateCodes();
            setGeneratedCodes(newCodes);
            setIsMfaModalOpen(false);
        } catch {
            // Error is handled by the hook and shown in UI
        } finally {
            setIsGenerating(false);
        }
    };

    let actionButtonLabel = 'Regenerate Codes';
    if (isGenerating) {
        actionButtonLabel = 'Processing...';
    } else if (totalSlots === 0) {
        actionButtonLabel = 'Generate Codes';
    }

    const handleCloseCodesModal = () => {
        // Crucial security requirement: wipe codes from local state immediately
        setGeneratedCodes(null);
    };

    return (
        <div className="space-y-6 animate-fade-in text-[#1D2939] dark:text-[#E2E8F0]">
            <div className="flex justify-between items-center border-b border-[#EAECF0] dark:border-[#3A4158] pb-4">
                <div>
                    <h3 className="text-xl font-bold">Recovery Codes</h3>
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8] mt-1">
                        Generate recovery codes to recover access if your MFA device is unavailable.
                    </p>
                </div>
                <button
                    onClick={totalSlots === 0 ? handleGenerateCodes : handleRegenerateRequest}
                    disabled={isGenerating}
                    className="rounded-xl border border-[#252955] dark:border-[#04ECB8] p-3 text-xs  text-[#252955] dark:text-[#04ECB8] hover:bg-[#EEF2FF] dark:hover:bg-[#313567]/50 transition-colors"
                >
                    {actionButtonLabel}
                </button>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] dark:border-[#3A4158] p-5 bg-white dark:bg-[#1E2530]">
                {totalSlots === 0 ? (
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                        Recovery codes have not been generated yet. Click Generate Recovery Codes to
                        create 12 one-time backup codes.
                    </p>
                ) : (
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                        You have utilized {usedSlots} out of {totalSlots} recovery codes (
                        {utilizationPercent}%). Remaining available codes: {remainingSlots}.
                    </p>
                )}
            </div>

            {/* Modals */}
            <MfaVerificationModal
                isOpen={isMfaModalOpen}
                onClose={() => setIsMfaModalOpen(false)}
                onVerified={handleMfaVerified}
                isLoading={isGenerating}
            />

            <RecoveryCodesModal
                isOpen={!!generatedCodes}
                codes={generatedCodes || []}
                onClose={handleCloseCodesModal}
            />
        </div>
    );
};
