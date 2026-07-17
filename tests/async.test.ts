import { describe, it, vi } from 'vitest'
import { waitFor } from '../src/async'

describe(waitFor, () => {
  it('should resolve after specified ms', async () => {
    vi.useFakeTimers()
    const promise = waitFor(100)
    vi.advanceTimersByTime(100)
    await promise
    vi.useRealTimers()
  })
})
