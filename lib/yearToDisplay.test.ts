import { describe, it, expect } from 'vitest'
import { yearToDisplay } from './yearToDisplay'

describe('yearToDisplay — stubs (Wave 0)', () => {
  it('infrastructure: vitest runs in node environment', () => {
    expect(typeof process).toBe('object')
  })

  it("formats -52 as '52 av. J.-C.' in French", () => {
    expect(yearToDisplay(-52, 'fr')).toBe('52 av. J.-C.')
  })

  it("formats -52 as '52 BC' in English", () => {
    expect(yearToDisplay(-52, 'en')).toBe('52 BC')
  })

  it("formats -3000 as '3000 BC' in English", () => {
    expect(yearToDisplay(-3000, 'en')).toBe('3000 BC')
  })

  it("treats year 0 as 1 BC — display guard (D-06): yearToDisplay(0, 'en') === '1 BC'", () => {
    expect(yearToDisplay(0, 'en')).toBe('1 BC')
  })

  it("treats year 0 as 1 BC in French: yearToDisplay(0, 'fr') === '1 av. J.-C.'", () => {
    expect(yearToDisplay(0, 'fr')).toBe('1 av. J.-C.')
  })

  it("treats year -1 as 1 BC: yearToDisplay(-1, 'en') === '1 BC'", () => {
    expect(yearToDisplay(-1, 'en')).toBe('1 BC')
  })

  it("formats positive years as plain number: yearToDisplay(1, 'en') === '1'", () => {
    expect(yearToDisplay(1, 'en')).toBe('1')
  })

  it("formats 1789 as '1789' in French", () => {
    expect(yearToDisplay(1789, 'fr')).toBe('1789')
  })

  it('defaults locale to French when not specified', () => {
    expect(yearToDisplay(-52)).toBe('52 av. J.-C.')
  })
})
