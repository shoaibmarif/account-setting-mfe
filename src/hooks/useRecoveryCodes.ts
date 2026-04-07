import { useState, useEffect, useCallback } from 'react';
import {
    recoveryCodesService,
    type RecoveryCodesStatus,
} from '../services/recoveryCodes.service';

const EMPTY_RECOVERY_CODES_STATUS: RecoveryCodesStatus = {
    slots: [],
    codes: [],
    totalCount: 0,
    usedCount: 0,
    unusedCount: 0,
    isMfaEnabled: false,
};

const getSessionEmployeeId = (): string => {
    try {
        const storedIdentity = localStorage.getItem('sessionIdentity');
        if (!storedIdentity) {
            return '';
        }

        const parsedIdentity = JSON.parse(storedIdentity) as { employeeId?: string | number };
        const resolvedEmployeeId = parsedIdentity?.employeeId;

        return resolvedEmployeeId ? String(resolvedEmployeeId) : '';
    } catch {
        return '';
    }
};

export const useRecoveryCodes = (employeeId?: string) => {
    const resolvedEmployeeId = employeeId || getSessionEmployeeId();
    const [status, setStatus] = useState<RecoveryCodesStatus>(EMPTY_RECOVERY_CODES_STATUS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStatus = useCallback(async () => {
        if (!resolvedEmployeeId) {
            setStatus(EMPTY_RECOVERY_CODES_STATUS);
            setError('Employee ID not found in sessionIdentity');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await recoveryCodesService.getStatus(resolvedEmployeeId);
            setStatus(data);
            setError(null);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to load recovery codes status');
        } finally {
            setLoading(false);
        }
    }, [resolvedEmployeeId]);

    useEffect(() => {
        loadStatus();
    }, [loadStatus]);

    const issueCodes = async () => {
        if (!resolvedEmployeeId) {
            const missingEmployeeError = new Error('Employee ID not found in sessionIdentity');
            setError(missingEmployeeError.message);
            throw missingEmployeeError;
        }

        try {
            const response = await recoveryCodesService.issueBatch(resolvedEmployeeId);
            setStatus(response);
            return response.codes;
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to issue recovery codes');
            throw error;
        }
    };

    const regenerateCodes = async () => {
        if (!resolvedEmployeeId) {
            const missingEmployeeError = new Error('Employee ID not found in sessionIdentity');
            setError(missingEmployeeError.message);
            throw missingEmployeeError;
        }

        try {
            const response = await recoveryCodesService.regenerateBatch(resolvedEmployeeId);
            setStatus(response);
            return response.codes;
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to regenerate recovery codes');
            throw error;
        }
    };

    return {
        slots: status.slots,
        codes: status.codes,
        totalCount: status.totalCount,
        usedCount: status.usedCount,
        unusedCount: status.unusedCount,
        isMfaEnabled: status.isMfaEnabled,
        securityNote: status.securityNote,
        loading,
        error,
        issueCodes,
        regenerateCodes,
        refresh: loadStatus,
    };
};
