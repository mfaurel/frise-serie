/**
 * yearToPixel — piecewise-linear year-to-pixel mapping.
 *
 * The timeline uses a non-linear time scale: each historical era has its own
 * pixelsPerYear density so that era-rich periods are more spacious than
 * sparse ancient periods (D-01, TL-02).
 *
 * All era boundaries are derived solely from data/eras.ts (D-04) — nothing
 * is hardcoded here.
 *
 * BC convention (D-05): negative integers represent BC years.
 *   -3000 = 3000 BC (TIMELINE_START), 2025 = TIMELINE_END.
 *
 * Clamping (T-03-01): years outside [TIMELINE_START, TIMELINE_END] are
 * clamped to 0px or TOTAL_WIDTH respectively. No extrapolation.
 */
import { ERAS } from '@/data/eras'
import type { HistoricalEra } from '@/types'

/** Cumulative pixel offsets for each era start, plus one sentinel at the end. */
function buildOffsets(eras: HistoricalEra[]): number[] {
  const offsets: number[] = []
  let cumulative = 0
  for (const era of eras) {
    offsets.push(cumulative)
    cumulative += (era.yearEnd - era.yearStart) * era.pixelsPerYear
  }
  // Sentinel: total width
  offsets.push(cumulative)
  return offsets
}

const ERA_OFFSETS = buildOffsets(ERAS)

/**
 * Total pixel width of the timeline.
 * Equals sum of (era.yearEnd - era.yearStart) * era.pixelsPerYear across all eras.
 * Expected value: 9135px.
 */
export const TOTAL_WIDTH: number = ERA_OFFSETS[ERA_OFFSETS.length - 1]

/**
 * First year on the timeline, derived from ERAS[0].yearStart (D-04).
 * Value: -3000 (3000 BC).
 */
export const TIMELINE_START: number = ERAS[0].yearStart

/**
 * Last year on the timeline, derived from ERAS[ERAS.length - 1].yearEnd (D-04).
 * Value: 2025.
 */
export const TIMELINE_END: number = ERAS[ERAS.length - 1].yearEnd

/**
 * Convert a historical year to a pixel offset on the timeline.
 *
 * Uses inclusive era boundaries: year >= era.yearStart && year <= era.yearEnd.
 * Adjacent eras share their boundary year — the shared year always resolves
 * to the earlier era's formula, producing the same pixel value either way.
 *
 * @param year  Historical year (negative = BC). 0 is in the antiquity era.
 * @returns     Pixel offset in [0, TOTAL_WIDTH], clamped for out-of-range years.
 */
export function yearToPixel(year: number): number {
  // Clamp below
  if (year <= TIMELINE_START) return 0
  // Clamp above
  if (year >= TIMELINE_END) return TOTAL_WIDTH

  for (let i = 0; i < ERAS.length; i++) {
    const era = ERAS[i]
    if (year >= era.yearStart && year <= era.yearEnd) {
      return ERA_OFFSETS[i] + (year - era.yearStart) * era.pixelsPerYear
    }
  }

  // Should never reach here given the clamp guards above
  return TOTAL_WIDTH
}

/**
 * Convert a pixel offset back to a historical year.
 *
 * Inverse of yearToPixel. Due to floating-point arithmetic, use Math.round()
 * when comparing against integer years (see RESEARCH.md Pitfall 3).
 *
 * @param px  Pixel offset in [0, TOTAL_WIDTH].
 * @returns   Fractional year (use Math.round() for integer comparison).
 */
export function pixelToYear(px: number): number {
  // Clamp below
  if (px <= 0) return TIMELINE_START
  // Clamp above
  if (px >= TOTAL_WIDTH) return TIMELINE_END

  for (let i = 0; i < ERAS.length; i++) {
    const eraEnd = ERA_OFFSETS[i + 1]
    if (px <= eraEnd) {
      return ERAS[i].yearStart + (px - ERA_OFFSETS[i]) / ERAS[i].pixelsPerYear
    }
  }

  return TIMELINE_END
}
