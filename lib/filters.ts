import type { Genre, Platform, Region, Show } from "@/types";

export type ShowPredicate = (show: Show) => boolean;

export interface ShowFilterCriteria {
  regions?: Region[];
  genres?: Genre[];
  platforms?: Platform[];
  minAccuracy?: number;
}

function intersects<T>(showValues: readonly T[], criteriaValues: readonly T[]): boolean {
  return showValues.some((value) => criteriaValues.includes(value));
}

/**
 * Per D003: an undefined or empty criteria array means "no filter for this
 * category" (matches all shows); otherwise a show matches if its own array
 * intersects the criteria array (OR-within-category).
 */
export function byRegions(regions?: Region[]): ShowPredicate {
  return (show) => !regions || regions.length === 0 || intersects(show.regions, regions);
}

export function byGenres(genres?: Genre[]): ShowPredicate {
  return (show) => !genres || genres.length === 0 || intersects(show.genres, genres);
}

export function byPlatforms(platforms?: Platform[]): ShowPredicate {
  return (show) => !platforms || platforms.length === 0 || intersects(show.platforms, platforms);
}

/**
 * Per D003: minAccuracy is a threshold, not a set filter — a show matches if
 * historicalAccuracyScore >= minAccuracy. undefined means no filter.
 */
export function byMinAccuracy(minAccuracy?: number): ShowPredicate {
  return (show) => minAccuracy === undefined || show.historicalAccuracyScore >= minAccuracy;
}

/** Combines predicates with AND-across-categories per D003. */
export function combinePredicates(predicates: ShowPredicate[]): ShowPredicate {
  return (show) => predicates.every((predicate) => predicate(show));
}

export function buildShowFilterPredicate(criteria: ShowFilterCriteria): ShowPredicate {
  return combinePredicates([
    byRegions(criteria.regions),
    byGenres(criteria.genres),
    byPlatforms(criteria.platforms),
    byMinAccuracy(criteria.minAccuracy),
  ]);
}

export function filterShows(shows: Show[], criteria: ShowFilterCriteria): Show[] {
  return shows.filter(buildShowFilterPredicate(criteria));
}
