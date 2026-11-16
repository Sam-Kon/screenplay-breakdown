import type { Shot } from "./schemas";

export type ShotListRecord = {
    id: string;
    scene: string;
    shots: Shot[];
    createdAt: string;
};

const g = globalThis as unknown as { __store?: Map<string, ShotListRecord> };
export const store = (g.__store ??= new Map());