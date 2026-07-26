import { describe, expect, it } from "vitest";
import {
  byGenres,
  byMinAccuracy,
  byPlatforms,
  byRegions,
  combinePredicates,
  filterShows,
} from "@/lib/filters";
import { shows } from "@/data/shows";

const spartacus = shows.find((show) => show.id === "spartacus")!;
const rome = shows.find((show) => show.id === "rome")!;

describe("byRegions", () => {
  it("matches a show whose regions intersect the criteria", () => {
    expect(byRegions(["mediterranean"])(spartacus)).toBe(true);
  });

  it("rejects a show whose regions do not intersect the criteria", () => {
    expect(byRegions(["asia_east"])(spartacus)).toBe(false);
  });

  it("matches on OR-within-category when any region overlaps", () => {
    expect(byRegions(["asia_east", "europe_west"])(rome)).toBe(true);
  });

  it("treats undefined as no filter (matches all)", () => {
    expect(byRegions(undefined)(spartacus)).toBe(true);
  });

  it("treats an empty array as no filter (matches all)", () => {
    expect(byRegions([])(spartacus)).toBe(true);
  });
});

describe("byGenres", () => {
  it("matches a show whose genres intersect the criteria", () => {
    expect(byGenres(["peplum"])(spartacus)).toBe(true);
  });

  it("rejects a show whose genres do not intersect the criteria", () => {
    expect(byGenres(["western"])(spartacus)).toBe(false);
  });

  it("treats an empty array as no filter (matches all)", () => {
    expect(byGenres([])(spartacus)).toBe(true);
  });
});

describe("byPlatforms", () => {
  it("matches a show whose platforms intersect the criteria", () => {
    expect(byPlatforms(["prime_video"])(spartacus)).toBe(true);
  });

  it("rejects a show whose platforms do not intersect the criteria", () => {
    expect(byPlatforms(["netflix"])(spartacus)).toBe(false);
  });

  it("treats undefined as no filter (matches all)", () => {
    expect(byPlatforms(undefined)(spartacus)).toBe(true);
  });
});

describe("byMinAccuracy", () => {
  it("matches a show at or above the threshold", () => {
    expect(byMinAccuracy(4)(rome)).toBe(true);
  });

  it("rejects a show below the threshold", () => {
    expect(byMinAccuracy(3)(spartacus)).toBe(false);
  });

  it("matches exactly at the threshold boundary", () => {
    expect(byMinAccuracy(2)(spartacus)).toBe(true);
  });

  it("treats undefined as no filter (matches all)", () => {
    expect(byMinAccuracy(undefined)(spartacus)).toBe(true);
  });
});

describe("combinePredicates", () => {
  it("returns true only when every predicate returns true (AND)", () => {
    const alwaysTrue = combinePredicates([() => true, () => true]);
    const oneFalse = combinePredicates([() => true, () => false]);
    expect(alwaysTrue(spartacus)).toBe(true);
    expect(oneFalse(spartacus)).toBe(false);
  });

  it("returns true for an empty predicate list (vacuous AND)", () => {
    expect(combinePredicates([])(spartacus)).toBe(true);
  });
});

describe("filterShows against the real dataset (data/shows.ts, 53 shows)", () => {
  it("returns every show when criteria is empty", () => {
    expect(filterShows(shows, {})).toHaveLength(shows.length);
  });

  it("filters by a single region and matches a manual filter over the real dataset", () => {
    const result = filterShows(shows, { regions: ["mediterranean"] });
    const expected = shows.filter((show) => show.regions.includes("mediterranean"));
    expect(result).toHaveLength(expected.length);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((show) => show.regions.includes("mediterranean"))).toBe(true);
  });

  it("ORs within a category across multiple regions", () => {
    const result = filterShows(shows, { regions: ["mediterranean", "asia_east"] });
    const expected = shows.filter(
      (show) => show.regions.includes("mediterranean") || show.regions.includes("asia_east"),
    );
    expect(result).toHaveLength(expected.length);
  });

  it("ANDs across categories (region AND genre)", () => {
    const result = filterShows(shows, {
      regions: ["mediterranean"],
      genres: ["peplum"],
    });
    const expected = shows.filter(
      (show) => show.regions.includes("mediterranean") && show.genres.includes("peplum"),
    );
    expect(result).toHaveLength(expected.length);
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((show) => show.regions.includes("mediterranean") && show.genres.includes("peplum")),
    ).toBe(true);
  });

  it("applies the minAccuracy threshold across the real dataset", () => {
    const result = filterShows(shows, { minAccuracy: 4 });
    const expected = shows.filter((show) => show.historicalAccuracyScore >= 4);
    expect(result).toHaveLength(expected.length);
    expect(result.every((show) => show.historicalAccuracyScore >= 4)).toBe(true);
  });

  it("returns an empty array when no show satisfies an impossible threshold", () => {
    expect(filterShows(shows, { minAccuracy: 6 })).toEqual([]);
  });

  it("treats an empty-array category the same as an absent one", () => {
    const withEmpty = filterShows(shows, { regions: [] });
    const withUndefined = filterShows(shows, {});
    expect(withEmpty).toHaveLength(withUndefined.length);
  });

  it("ORs within the platforms category and matches a manual filter", () => {
    const result = filterShows(shows, { platforms: ["arte", "canal_plus"] });
    const expected = shows.filter(
      (show) => show.platforms.includes("arte") || show.platforms.includes("canal_plus"),
    );
    expect(result).toHaveLength(expected.length);
    expect(
      result.every((show) => show.platforms.includes("arte") || show.platforms.includes("canal_plus")),
    ).toBe(true);
  });
});
