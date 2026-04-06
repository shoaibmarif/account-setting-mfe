import { useState, useEffect, useCallback } from 'react';
import { recoveryCodesService, RecoveryCodeSlot } from '../services/recoveryCodes.service';

export const useRecoveryCodes = (employeeId: string) => {
    const [slots, setSlots] = useState<RecoveryCodeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStatus = useCallback(async () => {
        if (!employeeId?.trim()) {
            setSlots([]);
            setError('Employee ID not found for recovery codes API.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await recoveryCodesService.getStatus(employeeId);
            setSlots(data);
            setError(null);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to load recovery codes status');
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    useEffect(() => {
        loadStatus();
    }, [loadStatus]);

    const issueCodes = async () => {
        try {
            const response = await recoveryCodesService.issueBatch(employeeId);
            setSlots(response.slots);
            return response.codes;
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to issue recovery codes');
            throw error;
        }
    };

    const regenerateCodes = async () => {
        try {
            const response = await recoveryCodesService.regenerateBatch(employeeId);
            setSlots(response.slots);
            return response.codes;
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to regenerate recovery codes');
            throw error;
        }
    };

    return { slots, loading, error, issueCodes, regenerateCodes, refresh: loadStatus };
};
