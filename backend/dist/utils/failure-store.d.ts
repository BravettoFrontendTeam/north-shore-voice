export interface FailureRecord {
    id: string;
    timestamp: string;
    service: string;
    kind: string;
    message: string;
    metadata?: Record<string, any>;
}
export declare function recordFailure(service: string, kind: string, message: string, metadata?: Record<string, any>): any;
export declare function getRecentFailures(limit?: number): FailureRecord[];
declare const _default: {
    recordFailure: typeof recordFailure;
    getRecentFailures: typeof getRecentFailures;
};
export default _default;
//# sourceMappingURL=failure-store.d.ts.map