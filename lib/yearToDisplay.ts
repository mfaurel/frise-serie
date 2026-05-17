/**
 * yearToDisplay — formats a historical year for display.
 *
 * Convention (D-05): negative integers are BC years.
 *   -52 = 52 BC, -1 = 1 BC, 1 = 1 AD.
 *
 * Year-0 guard (D-06): year 0 is treated as 1 BC for display purposes.
 *   Shows must never store year 0; this guard catches any edge case.
 *
 * @param year   Historical year (negative = BC, positive = AD).
 *               0 is mapped to 1 BC (display guard only).
 * @param locale Output locale. Defaults to 'fr'.
 * @returns      Display string, e.g. '52 av. J.-C.' or '52 BC' or '1789'.
 */
export function yearToDisplay(
  year: number,
  locale: 'fr' | 'en' = 'fr',
): string {
  // Year-0 display guard: treat 0 as -1 (displays as "1 BC")
  const displayYear = year === 0 ? -1 : year

  if (displayYear < 0) {
    const absYear = Math.abs(displayYear)
    if (locale === 'en') {
      return `${absYear} BC`
    }
    return `${absYear} av. J.-C.`
  }

  return `${displayYear}`
}
