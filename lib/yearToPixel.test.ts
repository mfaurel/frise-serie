import { describe, it, expect } from 'vitest'
import { ERAS } from '@/data/eras'

describe('yearToPixel — stubs (Wave 0)', () => {
  it('infrastructure: @/ alias resolves and ERAS loads', () => {
    expect(ERAS.length).toBeGreaterThan(0)
  })

  it.todo('maps TIMELINE_START (-3000) to 0px')
  it.todo('maps TIMELINE_END (2025) to TOTAL_WIDTH')
  it.todo('produces denser pixels for renaissance vs antiquity (non-linear)')
  it.todo('handles BC/AD crossing — year 0 clamps correctly')
  it.todo('handles all era boundaries — adjacent eras share the same pixel')
  it.todo('clamps years before TIMELINE_START to 0px')
  it.todo('clamps years after TIMELINE_END to TOTAL_WIDTH')
  it.todo('round-trip: Math.round(pixelToYear(yearToPixel(-3000))) === -3000')
  it.todo('round-trip: Math.round(pixelToYear(yearToPixel(-52))) === -52')
  it.todo('round-trip: Math.round(pixelToYear(yearToPixel(476))) === 476')
  it.todo('round-trip: Math.round(pixelToYear(yearToPixel(1789))) === 1789')
  it.todo('round-trip: Math.round(pixelToYear(yearToPixel(2024))) === 2024')
})
