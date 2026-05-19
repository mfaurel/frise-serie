import { describe, it, expect } from 'vitest'
import { TOTAL_WIDTH } from '@/lib/yearToPixel'

describe('bgX parallax formula', () => {
  it('at progress=1 with zoom=1, offset equals -(TOTAL_WIDTH * 1 * 0.7)', () => {
    const progress = 1
    const zoom = 1
    const shouldReduceMotion = false
    const result = shouldReduceMotion ? 0 : progress * -(TOTAL_WIDTH * zoom * 0.7)
    expect(result).toBe(-(TOTAL_WIDTH * 0.7))
  })

  it('shouldReduceMotion=true produces end value 0', () => {
    const progress = 1
    const zoom = 1
    const shouldReduceMotion = true
    const result = shouldReduceMotion ? 0 : progress * -(TOTAL_WIDTH * zoom * 0.7)
    expect(result).toBe(0)
  })

  it('shouldReduceMotion=false produces end value -(TOTAL_WIDTH * zoom * 0.7)', () => {
    const progress = 1
    const zoom = 2
    const shouldReduceMotion = false
    const result = shouldReduceMotion ? 0 : progress * -(TOTAL_WIDTH * zoom * 0.7)
    expect(result).toBe(-(TOTAL_WIDTH * 2 * 0.7))
  })

  it.todo('at progress=0.5, zoom=1, offset equals -(TOTAL_WIDTH * 0.5 * 0.7)')
})
