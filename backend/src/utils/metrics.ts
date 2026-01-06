export function emitMetric(name: string, value: number | string, tags: Record<string, string> = {}) {
  // Minimal emitter: logs a structured metric line for now; can be adapted to Prometheus/Datadog later.
  try {
    const ts = new Date().toISOString()
    console.info(JSON.stringify({ ts, metric: name, value, tags }))
  } catch (e) {
    // best-effort
  }
}

export default { emitMetric }
