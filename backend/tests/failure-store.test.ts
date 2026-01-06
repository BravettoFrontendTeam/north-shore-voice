import fs from 'fs'
import path from 'path'
import { recordFailure, getRecentFailures } from '../src/utils/failure-store'

describe('failure store', () => {
  const dir = path.resolve(__dirname, '..', 'data')
  const file = path.join(dir, 'failures.log')

  beforeAll(() => {
    try { fs.unlinkSync(file) } catch (e) {}
  })

  it('records and retrieves failures', () => {
    const r = recordFailure('testsvc', 'unit_test', 'something failed', { foo: 'bar' })
    expect(r).toBeTruthy()
    const list = getRecentFailures(10)
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
    expect(list[0].service).toBe('testsvc')
  })
})
