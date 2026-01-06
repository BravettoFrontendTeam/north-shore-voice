import { emitMetric } from '../src/utils/metrics'

describe('metrics emitter', () => {
  it('does not throw when called', () => {
    expect(() => emitMetric('test.metric', 123, { provider: 'test' })).not.toThrow()
  })
})
