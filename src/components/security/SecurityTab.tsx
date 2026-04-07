import React, { useState } from 'react';
import { useRecoveryCodes } from '../../hooks/useRecoveryCodes';
import { RecoveryCodesModal } from './RecoveryCodesModal';
import { MfaVerificationModal } from './MfaVerificationModal';

export const SecurityTab: React.FC = () => {
    const resolveEmployeeId = () => {
        const queryEmployeeId = new URLSearchParams(globalThis.location?.search ?? '').get(
            'employeeId',
        );
        const sessionEmployeeId = globalThis.sessionStorage?.getItem('employeeId');
        const localEmployeeId = globalThis.localStorage?.getItem('employeeId');
        return (queryEmployeeId ?? sessionEmployeeId ?? localEmployeeId ?? '').trim();
    };

    const employeeId = resolveEmployeeId();
    const {
        loading,
        error,
        issueCodes,
        regenerateCodes,
        refresh,
        totalCount,
        usedCount,
        unusedCount,
        isMfaEnabled,
        securityNote,
        codes,
        slots,
    } = useRecoveryCodes(employeeId);

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

    const totalSlots = totalCount;
    const usedSlots = usedCount;
    const remainingSlots = unusedCount;
    const utilizationPercent = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;

    const handleGenerateCodes = async () => {
        try {
            setIsGenerating(true);
            const newCodes = await issueCodes();
            setGeneratedCodes(newCodes);
            await refresh();
        } catch {
            // Error is handled by the hook and shown in UI
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateRequest = () => {
        if (!isMfaEnabled) {
            return;
        }

        setIsMfaModalOpen(true);
    };

    const handleMfaVerified = async () => {
        try {
            setIsGenerating(true);
            const newCodes = await regenerateCodes();
            setGeneratedCodes(newCodes);
            setIsMfaModalOpen(false);
            await refresh();
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

    console.log("Codes", codes)

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
                    disabled={isGenerating || totalSlots > 0}
                    className="rounded-xl border border-[#252955] dark:border-[#04ECB8] p-3 text-xs  text-[#252955] dark:text-[#04ECB8] hover:bg-[#EEF2FF] dark:hover:bg-[#313567]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    {actionButtonLabel}
                </button>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] dark:border-[#3A4158] p-5 bg-white dark:bg-[#1E2530] space-y-3">
                {totalSlots === 0 ? (
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                        Recovery codes have not been generated yet. Click Generate Recovery Codes to
                        create a new set of one-time backup codes.
                    </p>
                ) : (
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                        You have utilized {usedSlots} out of {totalSlots} recovery codes (
                        {utilizationPercent}%). Remaining available codes: {remainingSlots}.
                    </p>
                )}

                {!isMfaEnabled && (
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                        Multi-factor authentication should be enabled to securely regenerate recovery
                        codes.
                    </p>
                )}

                {securityNote && (
                    <p className="text-xs text-[#667085] dark:text-[#94A3B8]">{securityNote}</p>
                )}
            </div>

            {/* Recovery Codes Grid */}
            {totalSlots > 0 && codes.length > 0 && (
                <div className="rounded-2xl border border-[#EAECF0] dark:border-[#3A4158] p-5 bg-white dark:bg-[#1E2530]">
                    <h4 className="text-sm font-semibold mb-4 text-[#1D2939] dark:text-[#E2E8F0]">
                        Your Recovery Codes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {codes.map((code, index) => {
                            const slot = slots[index];
                            const isUsed = slot?.used ?? false;
                            const usedAtDate = slot?.usedAt
                                ? new Date(slot.usedAt).toLocaleDateString()
                                : null;

                            return (
                                <div
                                    key={`recovery-code-${slot?.sequenceNumber ?? index + 1}`}
                                    className={`rounded-lg border p-4 transition-all ${
                                        isUsed
                                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 opacity-60'
                                            : 'bg-[#EEF2FF] dark:bg-[#313567]/30 border-[#252955] dark:border-[#04ECB8]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                                            #{slot?.sequenceNumber ?? index + 1}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                isUsed
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            }`}
                                        >
                                            {isUsed ? 'Used' : 'Available'}
                                        </span>
                                    </div>
                                    <div
                                        className={`font-mono text-sm font-bold tracking-wide ${
                                            isUsed
                                                ? 'text-gray-400 dark:text-gray-600'
                                                : 'text-[#252955] dark:text-[#04ECB8]'
                                        }`}
                                    >
                                        {code}
                                    </div>
                                    {isUsed && usedAtDate && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            Used on {usedAtDate}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-4">
                        ⚠️ Store these codes in a secure location. Each code can only be used once.
                    </p>
                </div>
            )}

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
