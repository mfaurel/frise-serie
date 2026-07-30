import type { Era, DensityZone, Show } from "@/types";
import type { LaidOutShow } from "@/lib/swimLane";
import { yearToPixel } from "@/lib/yearToPixel";

export interface SpanBarDatum {
  showId: string;
  x1: number;
  x2: number;
  y: number;
  color: string;
}

export interface SegmentDatum {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  showIdA: string;
  showIdB: string;
}

function findEraForYear(year: number, eras: Era[]): Era {
  return eras.find((e) => year >= e.yearStart && year <= e.yearEnd) ?? eras[0];
}

/** Two shows are related if their genres arrays share at least one value. */
export function computeRelatedShows(shows: Show[]): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const show of shows) {
    const related: string[] = [];
    for (const other of shows) {
      if (other.id === show.id) continue;
      const hasSharedGenre = show.genres.some((g) => other.genres.includes(g));
      if (hasSharedGenre) {
        related.push(other.id);
      }
    }
    result.set(show.id, related);
  }
  return result;
}

/**
 * One SpanBarDatum per show where narrativeYearEnd !== null.
 * y is the vertical center of the 14px star-node (top + 7).
 * color is the last (most vibrant) swatch in the era's colorPalette.
 */
export function computeSpanBars(
  layout: LaidOutShow[],
  zones: DensityZone[],
  eras: Era[],
): SpanBarDatum[] {
  const result: SpanBarDatum[] = [];
  for (const item of layout) {
    const { show } = item;
    if (show.narrativeYearEnd === null) continue;
    const x1 = yearToPixel(show.narrativeYearStart, zones);
    const x2 = yearToPixel(show.narrativeYearEnd, zones);
    const y = item.top + 7;
    const era = findEraForYear(show.narrativeYearStart, eras);
    const color = era.colorPalette[era.colorPalette.length - 1];
    result.push({ showId: show.id, x1, x2, y, color });
  }
  return result;
}

/**
 * One SegmentDatum per unique unordered pair (A, B) where B is in related.get(A).
 * Key uses the lexicographically smaller ID first to ensure deduplication.
 */
export function computeConstellationSegments(
  layout: LaidOutShow[],
  related: Map<string, string[]>,
): SegmentDatum[] {
  const byId = new Map<string, LaidOutShow>();
  for (const item of layout) {
    byId.set(item.show.id, item);
  }

  const seen = new Set<string>();
  const result: SegmentDatum[] = [];

  for (const [idA, relatedIds] of related) {
    const itemA = byId.get(idA);
    if (!itemA) continue;
    for (const idB of relatedIds) {
      const minId = idA < idB ? idA : idB;
      const maxId = idA < idB ? idB : idA;
      const key = `${minId}--${maxId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const itemB = byId.get(idB);
      if (!itemB) continue;
      result.push({
        key,
        x1: itemA.left,
        y1: itemA.top + 7,
        x2: itemB.left,
        y2: itemB.top + 7,
        showIdA: idA,
        showIdB: idB,
      });
    }
  }

  return result;
}
