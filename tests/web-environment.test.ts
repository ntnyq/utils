import { describe, expect, it, vi } from 'vitest'
import { isBrowser } from '../src/web/environment'

describe(isBrowser, () => {
  it('should return false in node-like environment', () => {
    // Ensure no browser globals (use stubGlobal to override)
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('self', undefined)
    expect(isBrowser()).toBeFalsy()
  })

  it('should return true when browser globals exist', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const win = {} as any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const doc = {} as any
    // Set globals to simulate browser
    vi.stubGlobal('window', win)
    vi.stubGlobal('document', doc)
    // navigator is provided by Vitest environment; keep as-is
    vi.stubGlobal('self', win)

    expect(isBrowser()).toBeTruthy()
  })
})
