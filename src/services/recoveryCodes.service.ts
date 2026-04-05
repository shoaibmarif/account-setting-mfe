export interface RecoveryCodeSlot {
    sequenceNumber: number;
    used: boolean;
    usedAt?: string;
}

export interface GenerateBatchResponse {
    codes: string[];
    slots: RecoveryCodeSlot[];
}

// In a real app these would be backend endpoints.
// Start with no generated codes so the first action is "Generate Recovery Codes".
let mockSlots: RecoveryCodeSlot[] = [];

export const recoveryCodesService = {
    getStatus: async (): Promise<RecoveryCodeSlot[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...mockSlots]), 500);
        });
    },
    generateBatch: async (): Promise<GenerateBatchResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCodes = Array.from({ length: 12 }).map((_, i) => {
                    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
                    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
                    return `${(i + 1).toString().padStart(2, '0')}-${part1}-${part2}`;
                });
                mockSlots = Array.from({ length: 12 }).map((_, i) => ({
                    sequenceNumber: i + 1,
                    used: false,
                }));
                resolve({ codes: newCodes, slots: mockSlots });
            }, 1000);
        });
    },
    verifyAndBurn: async (code: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const seqMatch = /^(\d+)-/.exec(code);
                if (!seqMatch) {
                    reject(new Error('Invalid or incorrect sequence recovery code'));
                    return;
                }
                const seq = Number.parseInt(seqMatch[1]!, 10);
                const slot = mockSlots.find(s => s.sequenceNumber === seq);
                if (!slot || slot.used) {
                    reject(new Error('Invalid or incorrect sequence recovery code'));
                    return;
                }
                // Mock burning the code
                const updatedSlot = { ...slot, used: true, usedAt: new Date().toISOString() };
                mockSlots = mockSlots.map(s => s.sequenceNumber === seq ? updatedSlot : s);
                resolve(true);
            }, 800);
        });
    }
};
