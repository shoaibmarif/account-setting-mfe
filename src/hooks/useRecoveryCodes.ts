import { useState, useEffect, useCallback } from 'react';
import { recoveryCodesService, RecoveryCodeSlot } from '../services/recoveryCodes.service';

export const useRecoveryCodes = () => {
    const [slots, setSlots] = useState<RecoveryCodeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStatus = useCallback(async () => {
        try {
            setLoading(true);
            const data = await recoveryCodesService.getStatus();
            setSlots(data);
            setError(null);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to load recovery codes status');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStatus();
    }, [loadStatus]);

    const generateCodes = async () => {
        try {
            const response = await recoveryCodesService.generateBatch();
            setSlots(response.slots);
            return response.codes;
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to generate new recovery codes');
            throw error;
        }
    };

    return { slots, loading, error, generateCodes, refresh: loadStatus };
};
