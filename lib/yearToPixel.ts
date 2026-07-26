import type { DensityZone } from "@/types";

/**
 * Converts a historical year (no year zero: ...-2, -1, 1, 2...) to a continuous
 * astronomical year (...-2, -1, 0, 1...) so interpolation never overcounts the
 * missing year 0 when a zone spans the BC/AD boundary (TECHNICAL.md section 13).
 */
export function toAstronomicalYear(year: number): number {
  return year > 0 ? year - 1 : year;
}

/** Inverse of {@link toAstronomicalYear}. */
export function fromAstronomicalYear(astronomicalYear: number): number {
  return astronomicalYear >= 0 ? astronomicalYear + 1 : astronomicalYear;
}

/**
 * Finds the zone a year falls into using the same half-open [yearStart, yearEnd)
 * convention as buildDensityZones' era bucketing (last zone is fully inclusive).
 * Years outside the full covered range clamp to the nearest boundary zone so the
 * mapping stays total instead of throwing on slightly out-of-range input.
 */
function findZoneIndexForYear(year: number, zones: DensityZone[]): number {
  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const isLast = i === zones.length - 1;
    if (year >= zone.yearStart && (year < zone.yearEnd || isLast)) {
      return i;
    }
  }
  return year < zones[0].yearStart ? 0 : zones.length - 1;
}

/**
 * Maps a historical year to a pixel offset using the non-linear density zones
 * from buildDensityZones (ARCHITECTURE.md lines 148-178). Interpolates linearly
 * within the containing zone, adjusting for the missing year zero internally.
 */
export function yearToPixel(year: number, zones: DensityZone[]): number {
  if (zones.length === 0) {
    throw new Error("yearToPixel: zones must not be empty");
  }

  const zone = zones[findZoneIndexForYear(year, zones)];

  const astronomicalYear = toAstronomicalYear(year);
  const astronomicalZoneStart = toAstronomicalYear(zone.yearStart);
  const astronomicalZoneEnd = toAstronomicalYear(zone.yearEnd);
  const astronomicalSpan = astronomicalZoneEnd - astronomicalZoneStart;

  const fraction =
    astronomicalSpan !== 0
      ? (astronomicalYear - astronomicalZoneStart) / astronomicalSpan
      : 0;

  return zone.pixelStart + fraction * (zone.pixelEnd - zone.pixelStart);
}
