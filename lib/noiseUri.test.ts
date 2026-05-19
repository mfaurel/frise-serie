import { describe, it, expect } from 'vitest'
import { NOISE_SVG_URI } from '@/lib/noiseConstants'

describe('NOISE_SVG_URI encoding', () => {
  it('contains %23noise (Firefox-compatible filter reference)', () => {
    expect(NOISE_SVG_URI).toContain('%23noise')
  })

  it('starts with url("data:image/svg+xml,', () => {
    expect(NOISE_SVG_URI).toMatch(/^url\("data:image\/svg\+xml,/)
  })

  it('does not contain bare # character outside percent-encoding', () => {
    expect(NOISE_SVG_URI).not.toMatch(/#(?![\w])/)
    expect(NOISE_SVG_URI).not.toContain('=#')
    // Verify no bare '#' that isn't percent-encoded
    const withoutEncoded = NOISE_SVG_URI.replace(/%23/g, '')
    expect(withoutEncoded).not.toContain('#')
  })
})
