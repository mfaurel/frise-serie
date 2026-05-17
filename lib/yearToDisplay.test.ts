import { describe, it, expect } from 'vitest'

describe('yearToDisplay — stubs (Wave 0)', () => {
  it('infrastructure: vitest runs in node environment', () => {
    expect(typeof process).toBe('object')
  })

  it.todo("formats -52 as '52 av. J.-C.' in French")
  it.todo("formats -52 as '52 BC' in English")
  it.todo("formats -3000 as '3000 BC' in English")
  it.todo("treats year 0 as 1 BC — display guard (D-06): yearToDisplay(0, 'en') === '1 BC'")
  it.todo("treats year 0 as 1 BC in French: yearToDisplay(0, 'fr') === '1 av. J.-C.'")
  it.todo("treats year -1 as 1 BC: yearToDisplay(-1, 'en') === '1 BC'")
  it.todo("formats positive years as plain number: yearToDisplay(1, 'en') === '1'")
  it.todo("formats 1789 as '1789' in French")
  it.todo('defaults locale to French when not specified')
})
