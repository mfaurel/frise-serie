import { describe, expect, it } from "vitest";
import type { DensityZone, Era, Show } from "@/types";
import type { LaidOutShow } from "@/lib/swimLane";
import {
  computeRelatedShows,
  computeSpanBars,
  computeConstellationSegments,
} from "@/lib/constellationLines";

// yearToPixel(y, stubZones) = y - 1 for y in [1, 10001]
function makeStubZones(): DensityZone[] {
  return [
    {
      eraId: "stub",
      yearStart: 1,
      yearEnd: 10001,
      pxPerYear: 1,
      pixelStart: 0,
      pixelEnd: 10000,
    },
  ];
}

function makeStubEra(yearStart: number, yearEnd: number): Era {
  return {
    id: "stub",
    name: { fr: "Stub", en: "Stub" },
    yearStart,
    yearEnd,
    colorPalette: ["#000", "#111", "#222", "#f00"],
    backgroundAssetUrl: "",
    description: { fr: "", en: "" },
    keyEvents: [],
  };
}

function makeShow(
  id: string,
  genres: Show["genres"],
  narrativeYearEnd: number | null = null,
): Show {
  return {
    id,
    title: { fr: id, en: id, original: id },
    posterUrl: "",
    narrativeYearStart: 100,
    narrativeYearEnd,
    broadcastYearStart: 2000,
    broadcastYearEnd: null,
    historicalAccuracyScore: 3,
    genres,
    regions: ["europe_west"],
    platforms: ["netflix"],
    flashbacks: [],
    historicalContext: { fr: "", en: "" },
    historicalFigures: [],
    wikipediaUrl: "https://example.com",
    languages: ["fr"],
    countryAvailability: ["FR"],
  };
}

function makeLaidOut(
  show: Show,
  left: number,
  top: number,
  lane = 0,
): LaidOutShow {
  return { show, left, lane, top };
}

// ─── computeRelatedShows ──────────────────────────────────────────────────────

describe("computeRelatedShows", () => {
  it("two shows sharing one genre are related", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["medieval"]);
    const map = computeRelatedShows([a, b]);
    expect(map.get("a")).toContain("b");
    expect(map.get("b")).toContain("a");
  });

  it("two shows with no shared genres are not related", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["western"]);
    const map = computeRelatedShows([a, b]);
    expect(map.get("a")).not.toContain("b");
    expect(map.get("b")).not.toContain("a");
  });

  it("self is not in own related list", () => {
    const a = makeShow("a", ["medieval"]);
    const map = computeRelatedShows([a]);
    expect(map.get("a")).not.toContain("a");
  });

  it("show with no matching partners has empty related list", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["western"]);
    const map = computeRelatedShows([a, b]);
    expect(map.get("a")).toHaveLength(0);
  });
});

// ─── computeSpanBars ──────────────────────────────────────────────────────────

describe("computeSpanBars", () => {
  const zones = makeStubZones();
  const eras = [makeStubEra(1, 10001)];

  it("show with non-null narrativeYearEnd produces a SpanBarDatum", () => {
    const show = { ...makeShow("vikings", ["medieval"]), narrativeYearStart: 793, narrativeYearEnd: 1002 };
    const layout = [makeLaidOut(show, yearToPixelStub(793), 120)];
    const bars = computeSpanBars(layout, zones, eras);
    expect(bars).toHaveLength(1);
    expect(bars[0].showId).toBe("vikings");
    expect(bars[0].x1).toBeCloseTo(yearToPixelStub(793));
    expect(bars[0].x2).toBeCloseTo(yearToPixelStub(1002));
    expect(bars[0].y).toBe(120 + 7);
  });

  it("show with null narrativeYearEnd is excluded", () => {
    const show = makeShow("lone", ["medieval"], null);
    const layout = [makeLaidOut(show, 100, 120)];
    const bars = computeSpanBars(layout, zones, eras);
    expect(bars).toHaveLength(0);
  });

  it("color is the last swatch in the era colorPalette", () => {
    const show = { ...makeShow("s", ["medieval"]), narrativeYearStart: 100, narrativeYearEnd: 200 };
    const layout = [makeLaidOut(show, 99, 120)];
    const bars = computeSpanBars(layout, zones, eras);
    expect(bars[0].color).toBe("#f00");
  });
});

// yearToPixel stub for validation inside tests (mirrors the real formula for the stub zone)
function yearToPixelStub(year: number): number {
  // pixelStart=0, pixelEnd=10000, yearStart=1, yearEnd=10001
  // toAstronomicalYear(year > 0) = year - 1
  // fraction = (year-1 - 0) / (10000 - 0)
  // result = 0 + fraction * 10000 = year - 1
  return year - 1;
}

// ─── computeConstellationSegments ────────────────────────────────────────────

describe("computeConstellationSegments", () => {
  it("two related shows produce exactly one segment", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["medieval"]);
    const layout = [makeLaidOut(a, 10, 120), makeLaidOut(b, 200, 120)];
    const related = computeRelatedShows([a, b]);
    const segments = computeConstellationSegments(layout, related);
    expect(segments).toHaveLength(1);
    expect(segments[0].key).toBe("a--b");
  });

  it("non-related pair produces no segment", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["western"]);
    const layout = [makeLaidOut(a, 10, 120), makeLaidOut(b, 200, 120)];
    const related = computeRelatedShows([a, b]);
    const segments = computeConstellationSegments(layout, related);
    expect(segments).toHaveLength(0);
  });

  it("three mutually related shows produce exactly three segments (no duplicates)", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["medieval"]);
    const c = makeShow("c", ["medieval"]);
    const layout = [
      makeLaidOut(a, 10, 120),
      makeLaidOut(b, 200, 120),
      makeLaidOut(c, 400, 316),
    ];
    const related = computeRelatedShows([a, b, c]);
    const segments = computeConstellationSegments(layout, related);
    expect(segments).toHaveLength(3);
    const keys = segments.map((s) => s.key);
    expect(new Set(keys).size).toBe(3);
  });

  it("segment coordinates use left and top+7 of each laid-out show", () => {
    const a = makeShow("a", ["medieval"]);
    const b = makeShow("b", ["medieval"]);
    const layout = [makeLaidOut(a, 10, 100), makeLaidOut(b, 300, 200)];
    const related = computeRelatedShows([a, b]);
    const segments = computeConstellationSegments(layout, related);
    expect(segments[0].x1).toBe(10);
    expect(segments[0].y1).toBe(107);
    expect(segments[0].x2).toBe(300);
    expect(segments[0].y2).toBe(207);
  });
});
