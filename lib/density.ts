import type { DensityZone, Era, Show } from "@/types";
import { MAX_PX_PER_YEAR, MIN_PX_PER_YEAR } from "@/lib/constants";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function findEraForYear(year: number, sortedEras: Era[]): Era | undefined {
  for (let i = 0; i < sortedEras.length; i++) {
    const era = sortedEras[i];
    const isLast = i === sortedEras.length - 1;
    if (year >= era.yearStart && (year < era.yearEnd || (isLast && year <= era.yearEnd))) {
      return era;
    }
  }
  return undefined;
}

/**
 * Non-linear pixel mapping from show distribution per era (ARCHITECTURE.md lines 148-178).
 * Eras with above-average show density (bucketed by Show.narrativeYearStart, per D002)
 * get proportionally more pixels per year, capped by MIN_PX_PER_YEAR/MAX_PX_PER_YEAR.
 */
export function buildDensityZones(
  shows: Show[],
  eras: Era[],
  totalWidth: number,
): DensityZone[] {
  const sortedEras = [...eras].sort((a, b) => a.yearStart - b.yearStart);

  const showCountByEra = new Map<string, number>();
  for (const era of sortedEras) {
    showCountByEra.set(era.id, 0);
  }
  for (const show of shows) {
    const era = findEraForYear(show.narrativeYearStart, sortedEras);
    if (era) {
      showCountByEra.set(era.id, (showCountByEra.get(era.id) ?? 0) + 1);
    }
  }

  const avgShowCount = shows.length > 0 ? shows.length / sortedEras.length : 0;
  const totalYears = sortedEras.reduce(
    (sum, era) => sum + (era.yearEnd - era.yearStart),
    0,
  );
  const baseDensity = totalYears > 0 ? totalWidth / totalYears : 0;

  let pixelCursor = 0;
  return sortedEras.map((era) => {
    const showCount = showCountByEra.get(era.id) ?? 0;
    const weight = avgShowCount > 0 ? Math.max(1, showCount / avgShowCount) : 1;
    const pxPerYear = clamp(baseDensity * weight, MIN_PX_PER_YEAR, MAX_PX_PER_YEAR);
    const yearSpan = era.yearEnd - era.yearStart;
    const pixelStart = pixelCursor;
    const pixelEnd = pixelStart + yearSpan * pxPerYear;
    pixelCursor = pixelEnd;

    return {
      eraId: era.id,
      yearStart: era.yearStart,
      yearEnd: era.yearEnd,
      pxPerYear,
      pixelStart,
      pixelEnd,
    };
  });
}
