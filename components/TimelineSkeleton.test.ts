// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ERAS } from '@/data/eras'
import { yearToPixel } from '@/lib/yearToPixel'
import TimelineSkeleton from './TimelineSkeleton'

describe('TimelineSkeleton', () => {
  it('renders ERAS.length era band divs', () => {
    const { container } = render(React.createElement(TimelineSkeleton))
    const eraBands = container.querySelectorAll('.bg-stone-800')
    expect(eraBands).toHaveLength(ERAS.length)
  })

  // Iterate rendered divs and check each div's style.left against yearToPixel(era.yearStart) in pixels
  // Uses ERAS from @/data/eras and yearToPixel from @/lib/yearToPixel
  it.todo('each era band div has style.left equal to yearToPixel(era.yearStart)')

  // Check style.width equals (yearToPixel(era.yearEnd) - yearToPixel(era.yearStart)) in pixels
  // Uses ERAS from @/data/eras and yearToPixel from @/lib/yearToPixel
  it.todo('each era band div has correct width from yearToPixel span')

  // Find the h-px div with top:48 (the axis placeholder)
  it.todo('axis placeholder div is present at top: 48')

  it('has role=status for accessibility', () => {
    const { container } = render(React.createElement(TimelineSkeleton))
    const statusEl = container.querySelector('[role="status"]')
    expect(statusEl).not.toBeNull()
  })
})

// Suppress unused import warnings — these exports are used by the it.todo stubs above
void yearToPixel
