import { TIMELINE_START, TIMELINE_END, PIXELS_PER_YEAR } from '@/data/eras';

export function yearToPixel(year: number): number {
  return (year - TIMELINE_START) * PIXELS_PER_YEAR;
}

export function pixelToYear(px: number): number {
  return Math.round(px / PIXELS_PER_YEAR + TIMELINE_START);
}

export const TOTAL_WIDTH = yearToPixel(TIMELINE_END);

export function formatYear(year: number, locale: 'fr' | 'en' = 'fr'): string {
  if (year < 0) {
    return locale === 'fr' ? `${Math.abs(year)} av. J.-C.` : `${Math.abs(year)} BC`;
  }
  return `${year}`;
}
