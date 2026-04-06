import { authService } from './settings/auth.service';

export interface RecoveryCodeSlot {
    sequenceNumber: number;
    used: boolean;
    usedAt?: string;
}

export interface GenerateBatchResponse {
    codes: string[];
    slots: RecoveryCodeSlot[];
}

const normalizePayload = (response: any) =>
    response?.data?.payload ?? response?.data ?? response?.payload ?? response ?? {};

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

const normalizeSlots = (payload: any): RecoveryCodeSlot[] => {
    const rawSlots =
        payload?.slots ??
        payload?.recoveryCodeSlots ??
        payload?.status ??
        payload?.items ??
        [];

    if (!Array.isArray(rawSlots)) {
        return [];
    }

    return rawSlots.map((slot: any, index: number) => ({
        sequenceNumber:
            Number(slot?.sequenceNumber ?? slot?.sequence ?? slot?.id ?? index + 1) || index + 1,
        used: toBoolean(slot?.used ?? slot?.isUsed ?? slot?.consumed),
        usedAt: slot?.usedAt ?? slot?.consumedAt ?? slot?.updatedAt ?? undefined,
    }));
};

const normalizeCodes = (payload: any): string[] => {
    const rawCodes = payload?.codes ?? payload?.recoveryCodes ?? payload?.items ?? [];
    if (!Array.isArray(rawCodes)) {
        return [];
    }
    return rawCodes.filter((item: unknown): item is string => typeof item === 'string');
};

export const recoveryCodesService = {
    getStatus: async (employeeId: string): Promise<RecoveryCodeSlot[]> => {
        const response = await authService.getRecoveryCodes(employeeId);
        const payload = normalizePayload(response);
        return normalizeSlots(payload);
    },
    issueBatch: async (employeeId: string): Promise<GenerateBatchResponse> => {
        const response = await authService.issueRecoveryCodes({ employeeId });
        const payload = normalizePayload(response);
        return {
            codes: normalizeCodes(payload),
            slots: normalizeSlots(payload),
        };
    },
    regenerateBatch: async (employeeId: string): Promise<GenerateBatchResponse> => {
        const response = await authService.regenerateRecoveryCodes({ employeeId });
        const payload = normalizePayload(response);
        return {
            codes: normalizeCodes(payload),
            slots: normalizeSlots(payload),
        };
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
