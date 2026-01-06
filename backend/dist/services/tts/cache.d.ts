export declare function buildCacheKey(options: {
    text: string;
    voice?: string;
    provider?: string;
    emotion?: string;
    intensity?: number;
    pacing?: string;
}): string;
export declare function getCachedAudio(key: string): {
    audio_base64: string;
    metadata: Record<string, any>;
    createdAt: any;
} | null;
export declare function setCachedAudio(key: string, audio_base64: string, metadata?: Record<string, any>, ttlMs?: number): void;
declare const _default: {
    buildCacheKey: typeof buildCacheKey;
    getCachedAudio: typeof getCachedAudio;
    setCachedAudio: typeof setCachedAudio;
};
export default _default;
//# sourceMappingURL=cache.d.ts.map