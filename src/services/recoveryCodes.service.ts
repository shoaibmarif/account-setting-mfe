import { authService } from './settings/auth.service';

export interface RecoveryCodeSlot {
    sequenceNumber: number;
    used: boolean;
    usedAt?: string;
}

export interface RecoveryCodesStatus {
    slots: RecoveryCodeSlot[];
    codes: string[];
    totalCount: number;
    usedCount: number;
    unusedCount: number;
    isMfaEnabled: boolean;
    securityNote?: string;
}

export type GenerateBatchResponse = RecoveryCodesStatus;

const normalizePayload = (response: any) =>
    response?.data?.payload ?? response?.data ?? response?.payload ?? response ?? {};

const getCodeEntries = (payload: any): unknown[] => {
    const rawCodes = payload?.codes ?? payload?.recoveryCodes ?? payload?.items ?? [];
    return Array.isArray(rawCodes) ? rawCodes : [];
};

const toBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    return false;
};

const toNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : fallback;
    }

    return fallback;
};

const normalizeCodes = (payload: any): string[] => {
    const rawCodes = getCodeEntries(payload);

    return rawCodes
        .map((item: unknown) => {
            if (typeof item === 'string') {
                return item;
            }

            if (item && typeof item === 'object') {
                const codeEntry = item as {
                    maskedDisplay?: unknown;
                    recoveryCode?: unknown;
                    code?: unknown;
                    value?: unknown;
                };
                const resolvedCode = codeEntry.maskedDisplay ?? codeEntry.recoveryCode ?? codeEntry.code ?? codeEntry.value;
                return typeof resolvedCode === 'string' ? resolvedCode : '';
            }

            return '';
        })
        .filter((item): item is string => Boolean(item));
};

const normalizeSlots = (payload: any, totalCount: number, usedCount: number): RecoveryCodeSlot[] => {
    const rawSlots =
        payload?.slots ??
        payload?.recoveryCodeSlots ??
        payload?.status ??
        payload?.items ??
        [];

    if (Array.isArray(rawSlots) && rawSlots.length > 0) {
        return rawSlots.map((slot: any, index: number) => {
            const usedAtValue = slot?.usedAt ?? slot?.usedAtUtc ?? slot?.consumedAt ?? slot?.updatedAt;

            return {
                sequenceNumber:
                    Number(slot?.sequenceNumber ?? slot?.sequence ?? slot?.id ?? index + 1) ||
                    index + 1,
                used: toBoolean(slot?.used ?? slot?.isUsed ?? slot?.consumed),
                ...(typeof usedAtValue === 'string' ? { usedAt: usedAtValue } : {}),
            };
        });
    }

    const rawCodeEntries = getCodeEntries(payload).filter(
        (item: unknown): item is Record<string, unknown> => Boolean(item) && typeof item === 'object',
    );

    if (rawCodeEntries.length > 0) {
        return rawCodeEntries.map((codeEntry, index) => {
            const usedAtValue =
                codeEntry['usedAtUtc'] ??
                codeEntry['usedAt'] ??
                codeEntry['consumedAt'] ??
                codeEntry['updatedAt'];

            return {
                sequenceNumber:
                    Number(
                        codeEntry['index'] ??
                            codeEntry['sequenceNumber'] ??
                            codeEntry['sequence'] ??
                            codeEntry['id'] ??
                            index + 1,
                    ) || index + 1,
                used: toBoolean(
                    codeEntry['isUsed'] ?? codeEntry['used'] ?? codeEntry['consumed'],
                ),
                ...(typeof usedAtValue === 'string' ? { usedAt: usedAtValue } : {}),
            };
        });
    }

    const normalizedTotal = Math.max(totalCount, 0);
    const normalizedUsed = Math.min(Math.max(usedCount, 0), normalizedTotal);

    return Array.from({ length: normalizedTotal }, (_, index) => ({
        sequenceNumber: index + 1,
        used: index < normalizedUsed,
    }));
};

const normalizeStatus = (payload: any): RecoveryCodesStatus => {
    const rawCodeEntries = getCodeEntries(payload);
    const codes = normalizeCodes(payload);
    const fallbackTotalCount = Array.isArray(payload?.slots) ? payload.slots.length : rawCodeEntries.length;
    const derivedUsedCount = rawCodeEntries.reduce<number>((count, item) => {
        if (!item || typeof item !== 'object') {
            return count;
        }

        const codeEntry = item as Record<string, unknown>;
        return (
            count +
            (toBoolean(codeEntry['isUsed'] ?? codeEntry['used'] ?? codeEntry['consumed'])
                ? 1
                : 0)
        );
    }, 0);
    const totalCount = Math.max(toNumber(payload?.totalCount, fallbackTotalCount), 0);
    const usedCount = Math.min(
        Math.max(toNumber(payload?.usedCount, derivedUsedCount), 0),
        totalCount,
    );
    const derivedUnusedCount = Math.max(totalCount - usedCount, 0);
    const unusedCount = Math.min(
        Math.max(toNumber(payload?.unusedCount, derivedUnusedCount), 0),
        totalCount,
    );
    const securityNote = typeof payload?.securityNote === 'string' ? payload.securityNote : undefined;

    return {
        slots: normalizeSlots(payload, totalCount, usedCount),
        codes,
        totalCount,
        usedCount,
        unusedCount,
        isMfaEnabled: toBoolean(payload?.isMfaEnabled),
        ...(typeof securityNote === 'string' ? { securityNote } : {}),
    };
};

export const recoveryCodesService = {
    getStatus: async (employeeId: string): Promise<RecoveryCodesStatus> => {
        const response = await authService.getRecoveryCodes(employeeId);
        const payload = normalizePayload(response);
        return normalizeStatus(payload);
    },
    issueBatch: async (employeeId: string): Promise<GenerateBatchResponse> => {
        const response = await authService.issueRecoveryCodes({ employeeId });
        const payload = normalizePayload(response);
        return normalizeStatus(payload);
    },
    regenerateBatch: async (employeeId: string): Promise<GenerateBatchResponse> => {
        const response = await authService.regenerateRecoveryCodes({ employeeId });
        const payload = normalizePayload(response);
        return normalizeStatus(payload);
    },

    getCurrentCodes: async (employeeId: string): Promise<string[]> => {
        const response = await authService.getCurrentRecoveryCodes(employeeId);
        const payload = normalizePayload(response);
        return normalizeCodes(payload);
    },

    verifyAndBurn: async (employeeId: string, code: string): Promise<boolean> => {
        const response = await authService.verifyRecoveryCode({
            employeeId,
            recoveryCode: code,
        });
        const payload = normalizePayload(response);
        return Boolean(response?.success ?? response?.data?.success ?? payload?.success ?? true);
    },
};
