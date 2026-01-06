import fs from 'fs'
import path from 'path'

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data')
const EMPATHY_DIR = path.join(DATA_DIR, 'empathy-configs')
const ABE_KEYS_DIR = path.join(DATA_DIR, 'abekeys')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

ensureDir(EMPATHY_DIR)
ensureDir(ABE_KEYS_DIR)

export function getEmpathyConfig(facilityId: string) {
  const file = path.join(EMPATHY_DIR, `${facilityId}.json`)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch (e) {
    return null
  }
}

export function setEmpathyConfig(facilityId: string, config: any) {
  const file = path.join(EMPATHY_DIR, `${facilityId}.json`)
  fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8')
}

export function getAbeKeys(facilityId: string) {
  const file = path.join(ABE_KEYS_DIR, `${facilityId}.json`)
  if (process.env.AWS_SECRETS_ENABLED === 'true') {
    // In production, prefer SecretsManager (handled elsewhere)
    // Fall back to local file when not present
  }

  if (!fs.existsSync(file)) return null
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    return data
  } catch (e) {
    return null
  }
}

export function setAbeKeys(facilityId: string, keys: any) {
  const file = path.join(ABE_KEYS_DIR, `${facilityId}.json`)
  fs.writeFileSync(file, JSON.stringify(keys, null, 2), 'utf-8')
}
