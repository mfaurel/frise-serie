// @vitest-environment jsdom
import { describe, it } from 'vitest'
import { ERAS } from '@/data/eras'
import { yearToPixel } from '@/lib/yearToPixel'

// import TimelineSkeleton from './TimelineSkeleton' — uncomment in Wave 1

describe('TimelineSkeleton', () => {
  // Will use @testing-library/react render once TimelineSkeleton.tsx exists (Wave 1)
  // import TimelineSkeleton from './TimelineSkeleton'
  it.todo('renders ERAS.length era band divs')

  // Iterate rendered divs and check each div's style.left against yearToPixel(era.yearStart) in pixels
  // Uses ERAS from @/data/eras and yearToPixel from @/lib/yearToPixel
  it.todo('each era band div has style.left equal to yearToPixel(era.yearStart)')

  // Check style.width equals (yearToPixel(era.yearEnd) - yearToPixel(era.yearStart)) in pixels
  // Uses ERAS from @/data/eras and yearToPixel from @/lib/yearToPixel
  it.todo('each era band div has correct width from yearToPixel span')

  // Find the h-px div with top:48 (the axis placeholder)
  it.todo('axis placeholder div is present at top: 48')

  // Check aria role for accessibility (WCAG AA requirement)
  it.todo('has role=status for accessibility')
})

// Suppress unused import warnings — these exports are used by the it.todo stubs above
void ERAS
void yearToPixel
