import { describe, expect, it, vi } from 'vitest'
import { warnOnce } from '../src/logging'

describe(warnOnce, () => {
  it('should warn only once per message', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnOnce('msg')
    warnOnce('msg')
    warnOnce('another')
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })
})
