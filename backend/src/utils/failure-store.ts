import fs from 'fs'
import path from 'path'

const FAIL_DIR = path.resolve(__dirname, '..', '..', 'data')
const FAIL_FILE = path.join(FAIL_DIR, 'failures.log')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}
ensureDir(FAIL_DIR)

export interface FailureRecord {
  id: string
  timestamp: string
  service: string
  kind: string
  message: string
  metadata?: Record<string, any>
}

export function recordFailure(service: string, kind: string, message: string, metadata: Record<string, any> = {}) {
  try {
    const rec: FailureRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      service,
      kind,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      metadata,
    }
    fs.appendFileSync(FAIL_FILE, JSON.stringify(rec) + '\n', 'utf-8')
    return rec
  } catch (e) {
    // best-effort; swallow so it doesn't mask original errors
    console.error('Failed to write failure record', e)
    return null as any
  }
}

export function getRecentFailures(limit = 50) {
  try {
    if (!fs.existsSync(FAIL_FILE)) return []
    const lines = fs.readFileSync(FAIL_FILE, 'utf-8').trim().split('\n').filter(Boolean)
    const last = lines.slice(-limit)
    return last.map(l => JSON.parse(l) as FailureRecord).reverse() // newest first
  } catch (e) {
    console.error('Failed to read failures file', e)
    return []
  }
}

export default { recordFailure, getRecentFailures }
