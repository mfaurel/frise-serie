export type Locale = "fr" | "en";

/**
 * Formats a historical year for display per TECHNICAL.md section 13.
 * Negative years are BC; year 0 is the historical convention's "1st century"
 * placeholder (the dataset has no year-zero shows, but the formatter still
 * needs to handle it per the spec table).
 */
export function yearToDisplay(year: number, locale: Locale): string {
  if (year === 0) {
    return locale === "fr" ? "Ier s." : "1st c.";
  }

  if (year < 0) {
    const absYear = Math.abs(year);
    return locale === "fr" ? `${absYear} av. J.-C.` : `${absYear} BC`;
  }

  return `${year}`;
}
