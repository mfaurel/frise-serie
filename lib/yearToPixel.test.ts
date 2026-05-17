import { describe, it, expect } from 'vitest'
import { ERAS } from '@/data/eras'
import {
  yearToPixel,
  pixelToYear,
  TOTAL_WIDTH,
  TIMELINE_START,
  TIMELINE_END,
} from './yearToPixel'

describe('yearToPixel — stubs (Wave 0)', () => {
  it('infrastructure: @/ alias resolves and ERAS loads', () => {
    expect(ERAS.length).toBeGreaterThan(0)
  })

  it('maps TIMELINE_START (-3000) to 0px', () => {
    expect(yearToPixel(-3000)).toBe(0)
    expect(TIMELINE_START).toBe(-3000)
  })

  it('maps TIMELINE_END (2025) to TOTAL_WIDTH', () => {
    expect(yearToPixel(2025)).toBe(TOTAL_WIDTH)
    expect(TOTAL_WIDTH).toBe(9135)
    expect(TIMELINE_END).toBe(2025)
  })

  it('produces denser pixels for renaissance vs antiquity (non-linear)', () => {
    // 1 year in antiquity (-1000 to -999) = 1.0 px
    const antiquityWidth = yearToPixel(-999) - yearToPixel(-1000)
    // 1 year in renaissance (1400 to 1401) = 5.0 px
    const renaissanceWidth = yearToPixel(1401) - yearToPixel(1400)
    expect(renaissanceWidth).toBeGreaterThan(antiquityWidth)
    expect(antiquityWidth).toBeCloseTo(1.0, 5)
    expect(renaissanceWidth).toBeCloseTo(5.0, 5)
  })

  it('handles BC/AD crossing — year 0 clamps correctly', () => {
    // year 0 is not in the dataset but should land between year -1 and year 1
    // The implementation uses inclusive boundary: year >= era.yearStart && year <= era.yearEnd
    // antiquity spans -3000 to 476, so year 0 falls within antiquity
    const px0 = yearToPixel(0)
    expect(px0).toBeGreaterThan(yearToPixel(-1))
    expect(px0).toBeLessThan(yearToPixel(1))
  })

  it('handles all era boundaries — adjacent eras share the same pixel', () => {
    // yearToPixel(476) from antiquity side = yearToPixel(476) from early_middle_ages start
    // Both should produce the same pixel value (no jump)
    const antiquityEnd = yearToPixel(476)
    expect(antiquityEnd).toBe(3476)

    // Spot-check other boundaries
    expect(yearToPixel(1000)).toBe(4786)
    expect(yearToPixel(1400)).toBe(5986)
    expect(yearToPixel(1600)).toBe(6986)
    expect(yearToPixel(1789)).toBe(7742)
    expect(yearToPixel(1815)).toBe(7950)
    expect(yearToPixel(1900)).toBe(8375)
    expect(yearToPixel(1945)).toBe(8735)
  })

  it('clamps years before TIMELINE_START to 0px', () => {
    expect(yearToPixel(-9999)).toBe(0)
    expect(yearToPixel(-3001)).toBe(0)
  })

  it('clamps years after TIMELINE_END to TOTAL_WIDTH', () => {
    expect(yearToPixel(9999)).toBe(TOTAL_WIDTH)
    expect(yearToPixel(2026)).toBe(TOTAL_WIDTH)
  })

  it('round-trip: Math.round(pixelToYear(yearToPixel(-3000))) === -3000', () => {
    expect(Math.round(pixelToYear(yearToPixel(-3000)))).toBe(-3000)
  })

  it('round-trip: Math.round(pixelToYear(yearToPixel(-52))) === -52', () => {
    expect(Math.round(pixelToYear(yearToPixel(-52)))).toBe(-52)
  })

  it('round-trip: Math.round(pixelToYear(yearToPixel(476))) === 476', () => {
    expect(Math.round(pixelToYear(yearToPixel(476)))).toBe(476)
  })

  it('round-trip: Math.round(pixelToYear(yearToPixel(1789))) === 1789', () => {
    expect(Math.round(pixelToYear(yearToPixel(1789)))).toBe(1789)
  })

  it('round-trip: Math.round(pixelToYear(yearToPixel(2024))) === 2024', () => {
    expect(Math.round(pixelToYear(yearToPixel(2024)))).toBe(2024)
  })
})

describe('pixelToYear round-trip — all 15 D-13 test years', () => {
  const testYears = [-3000, -1000, -500, -52, 1, 476, 793, 1066, 1492, 1600, 1789, 1815, 1900, 1945, 2024]

  for (const year of testYears) {
    it(`round-trip for year ${year}`, () => {
      expect(Math.round(pixelToYear(yearToPixel(year)))).toBe(year)
    })
  }
})
