"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMetric = emitMetric;
function emitMetric(name, value, tags = {}) {
    // Minimal emitter: logs a structured metric line for now; can be adapted to Prometheus/Datadog later.
    try {
        const ts = new Date().toISOString();
        console.info(JSON.stringify({ ts, metric: name, value, tags }));
    }
    catch (e) {
        // best-effort
    }
}
exports.default = { emitMetric };
//# sourceMappingURL=metrics.js.map