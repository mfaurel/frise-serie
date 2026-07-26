import type { DensityZone } from "@/types";
import { fromAstronomicalYear, toAstronomicalYear } from "@/lib/yearToPixel";

/**
 * Finds the zone a pixel offset falls into using the same half-open
 * [pixelStart, pixelEnd) convention yearToPixel uses for years (last zone is
 * fully inclusive). Pixels outside the covered range clamp to the nearest
 * boundary zone so the mapping stays total instead of throwing.
 */
function findZoneIndexForPixel(px: number, zones: DensityZone[]): number {
  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const isLast = i === zones.length - 1;
    if (px >= zone.pixelStart && (px < zone.pixelEnd || isLast)) {
      return i;
    }
  }
  return px < zones[0].pixelStart ? 0 : zones.length - 1;
}

/**
 * Inverse of yearToPixel: maps a pixel offset back to the historical year it
 * represents. Exact for any pixel produced by yearToPixel, including across
 * the missing-year-zero BC/AD boundary.
 */
export function pixelToYear(px: number, zones: DensityZone[]): number {
  if (zones.length === 0) {
    throw new Error("pixelToYear: zones must not be empty");
  }

  const zone = zones[findZoneIndexForPixel(px, zones)];

  const pixelSpan = zone.pixelEnd - zone.pixelStart;
  const fraction = pixelSpan !== 0 ? (px - zone.pixelStart) / pixelSpan : 0;

  const astronomicalZoneStart = toAstronomicalYear(zone.yearStart);
  const astronomicalZoneEnd = toAstronomicalYear(zone.yearEnd);
  const astronomicalYear =
    astronomicalZoneStart + fraction * (astronomicalZoneEnd - astronomicalZoneStart);

  return fromAstronomicalYear(Math.round(astronomicalYear));
}
