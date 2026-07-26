import { describe, expect, it } from "vitest";
import { buildDensityZones } from "@/lib/density";
import { toAstronomicalYear, yearToPixel } from "@/lib/yearToPixel";
import { pixelToYear } from "@/lib/pixelToYear";
import { MAX_PX_PER_YEAR, MIN_PX_PER_YEAR, VIRTUAL_CANVAS_WIDTH } from "@/lib/constants";
import { shows } from "@/data/shows";
import { eras } from "@/data/eras";
import type { DensityZone, Era, Show } from "@/types";

const realZones = buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH);
const sortedRealEras = [...eras].sort((a, b) => a.yearStart - b.yearStart);

function makeEra(id: string, yearStart: number, yearEnd: number): Era {
  return {
    id,
    name: { fr: id, en: id },
    yearStart,
    yearEnd,
    colorPalette: ["#000000"],
    backgroundAssetUrl: "",
    description: { fr: "", en: "" },
    keyEvents: [],
  };
}

function makeShow(id: string, narrativeYearStart: number): Show {
  return {
    id,
    title: { fr: id, en: id, original: id },
    posterUrl: "",
    narrativeYearStart,
    narrativeYearEnd: null,
    broadcastYearStart: narrativeYearStart,
    broadcastYearEnd: null,
    historicalAccuracyScore: 3,
    genres: ["medieval"],
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

describe("buildDensityZones", () => {
  it("produces contiguous zones with no gaps or overlaps across real data", () => {
    for (let i = 1; i < realZones.length; i++) {
      expect(realZones[i].pixelStart, realZones[i].eraId).toBe(realZones[i - 1].pixelEnd);
      expect(realZones[i].yearStart, realZones[i].eraId).toBe(realZones[i - 1].yearEnd);
    }
  });

  it("keeps every real zone's pxPerYear within MIN_PX_PER_YEAR/MAX_PX_PER_YEAR", () => {
    for (const zone of realZones) {
      expect(zone.pxPerYear, zone.eraId).toBeGreaterThanOrEqual(MIN_PX_PER_YEAR);
      expect(zone.pxPerYear, zone.eraId).toBeLessThanOrEqual(MAX_PX_PER_YEAR);
    }
  });

  it("gives an era with above-average show density a higher pxPerYear than a below-average one", () => {
    const eraA = makeEra("era-a", 0, 100);
    const eraB = makeEra("era-b", 100, 200);
    const testShows = [
      makeShow("s1", 50),
      makeShow("s2", 150),
      makeShow("s3", 160),
      makeShow("s4", 170),
    ];

    const zones = buildDensityZones(testShows, [eraA, eraB], 200);
    const zoneA = zones.find((z) => z.eraId === "era-a")!;
    const zoneB = zones.find((z) => z.eraId === "era-b")!;

    expect(zoneA.pxPerYear).toBe(1);
    expect(zoneB.pxPerYear).toBe(1.5);
    expect(zoneA.pixelStart).toBe(0);
    expect(zoneA.pixelEnd).toBe(100);
    expect(zoneB.pixelStart).toBe(100);
    expect(zoneB.pixelEnd).toBe(250);
  });

  it("clamps pxPerYear to MIN_PX_PER_YEAR when base density would fall below it", () => {
    const eraLow = makeEra("era-low", 0, 100);
    const eraHigh = makeEra("era-high", 100, 200);
    const testShows = [
      makeShow("s1", 50),
      ...Array.from({ length: 19 }, (_, i) => makeShow(`s${i + 2}`, 150)),
    ];

    const zones = buildDensityZones(testShows, [eraLow, eraHigh], 20);
    const zoneLow = zones.find((z) => z.eraId === "era-low")!;

    expect(zoneLow.pxPerYear).toBe(MIN_PX_PER_YEAR);
  });

  it("clamps pxPerYear to MAX_PX_PER_YEAR when weighted density would exceed it", () => {
    const eraLow = makeEra("era-low", 0, 100);
    const eraHigh = makeEra("era-high", 100, 200);
    const testShows = [
      makeShow("s1", 50),
      ...Array.from({ length: 19 }, (_, i) => makeShow(`s${i + 2}`, 150)),
    ];

    const zones = buildDensityZones(testShows, [eraLow, eraHigh], 4000);
    const zoneHigh = zones.find((z) => z.eraId === "era-high")!;

    // baseDensity = 4000/200 = 20; weight = 19/10 = 1.9 -> unclamped 38, clamped to MAX_PX_PER_YEAR (20)
    expect(zoneHigh.pxPerYear).toBe(MAX_PX_PER_YEAR);
  });

  it("handles zero shows without dividing by zero (avgShowCount falls back to weight 1)", () => {
    const eraA = makeEra("era-a", 0, 100);
    const eraB = makeEra("era-b", 100, 200);

    const zones = buildDensityZones([], [eraA, eraB], 200);

    expect(zones[0].pxPerYear).toBe(1);
    expect(zones[1].pxPerYear).toBe(1);
  });

  it("sorts eras by yearStart regardless of input order", () => {
    const eraA = makeEra("era-a", 0, 100);
    const eraB = makeEra("era-b", 100, 200);

    const zones = buildDensityZones([], [eraB, eraA], 200);

    expect(zones.map((z) => z.eraId)).toEqual(["era-a", "era-b"]);
  });

  it("does not count a show whose narrativeYearStart falls in a gap between eras (findEraForYear returns undefined)", () => {
    const eraA = makeEra("era-a", 0, 100);
    const eraB = makeEra("era-b", 200, 300);
    const testShows = [
      makeShow("gap-show", 150),
      makeShow("s1", 250),
      makeShow("s2", 260),
      makeShow("s3", 270),
    ];

    const zones = buildDensityZones(testShows, [eraA, eraB], 200);
    const zoneA = zones.find((z) => z.eraId === "era-a")!;
    const zoneB = zones.find((z) => z.eraId === "era-b")!;

    // avgShowCount = 4 shows / 2 eras = 2. If the gap-show were (wrongly) counted
    // into era-b, showCount would be 4 and weight would be 2, not 1.5.
    expect(zoneA.pxPerYear).toBe(1);
    expect(zoneB.pxPerYear).toBe(1.5);
  });

  it("counts a show whose narrativeYearStart lands exactly on the last era's yearEnd (isLast inclusive branch)", () => {
    const eraA = makeEra("era-a", 0, 100);
    const eraB = makeEra("era-b", 100, 200);
    const testShows = [makeShow("on-boundary", 200)];

    const zones = buildDensityZones(testShows, [eraA, eraB], 200);
    const zoneA = zones.find((z) => z.eraId === "era-a")!;
    const zoneB = zones.find((z) => z.eraId === "era-b")!;

    // avgShowCount = 1/2 = 0.5; era-b's showCount of 1 gives weight max(1, 1/0.5) = 2
    expect(zoneA.pxPerYear).toBe(1);
    expect(zoneB.pxPerYear).toBe(2);
  });

  it("returns an empty array without dividing by zero when given no eras", () => {
    expect(buildDensityZones([], [], 100)).toEqual([]);
  });
});

describe("yearToPixel", () => {
  it("maps the Vikings narrative start (793) into the middle-ages zone, matching manual interpolation", () => {
    const middleAges = realZones.find((z) => z.eraId === "middle-ages")!;
    const expected = middleAges.pixelStart + middleAges.pxPerYear * (793 - middleAges.yearStart);

    const pixel = yearToPixel(793, realZones);

    expect(pixel).toBeCloseTo(expected, 9);
    expect(pixel).toBeGreaterThanOrEqual(middleAges.pixelStart);
    expect(pixel).toBeLessThan(middleAges.pixelEnd);
  });

  it("inverts back to 793 via pixelToYear (Vikings demo round-trip)", () => {
    const pixel = yearToPixel(793, realZones);
    expect(pixelToYear(pixel, realZones)).toBe(793);
  });

  it("maps a BC narrative year (Spartacus, -73) into the antiquity zone", () => {
    const antiquity = realZones.find((z) => z.eraId === "antiquity")!;
    const pixel = yearToPixel(-73, realZones);

    expect(pixel).toBeGreaterThanOrEqual(antiquity.pixelStart);
    expect(pixel).toBeLessThan(antiquity.pixelEnd);
    expect(pixelToYear(pixel, realZones)).toBe(-73);
  });

  it("treats the BC/AD transition as exactly one year (no year zero), not two", () => {
    const antiquity = realZones.find((z) => z.eraId === "antiquity")!;
    const pixelAt1BC = yearToPixel(-1, realZones);
    const pixelAt1AD = yearToPixel(1, realZones);

    // effective px-per-astronomical-year for this zone: pixelSpan / astroSpan
    const astroStart = toAstronomicalYear(antiquity.yearStart);
    const astroEnd = toAstronomicalYear(antiquity.yearEnd);
    const effectiveRatePerAstroYear =
      (antiquity.pixelEnd - antiquity.pixelStart) / (astroEnd - astroStart);
    // -1 -> astro -1, 1 -> astro 0: exactly one astronomical year apart (not two)
    expect(toAstronomicalYear(1) - toAstronomicalYear(-1)).toBe(1);
    expect(pixelAt1AD - pixelAt1BC).toBeCloseTo(effectiveRatePerAstroYear, 9);
  });

  it("lands era-boundary years (476) exactly on the shared antiquity/middle-ages pixel boundary", () => {
    const antiquity = realZones.find((z) => z.eraId === "antiquity")!;
    const middleAges = realZones.find((z) => z.eraId === "middle-ages")!;

    expect(antiquity.pixelEnd).toBe(middleAges.pixelStart);
    expect(yearToPixel(476, realZones)).toBe(middleAges.pixelStart);
  });

  it("includes the final zone's yearEnd inclusively (last-zone boundary)", () => {
    const lastZone = realZones[realZones.length - 1];
    const pixel = yearToPixel(lastZone.yearEnd, realZones);

    expect(pixel).toBe(lastZone.pixelEnd);
    expect(pixelToYear(pixel, realZones)).toBe(lastZone.yearEnd);
  });

  it("extrapolates using the nearest boundary zone's rate for years before the first zone, and round-trips exactly", () => {
    const firstZone = realZones[0];
    const yearBeforeRange = firstZone.yearStart - 1000;

    const pixel = yearToPixel(yearBeforeRange, realZones);

    expect(pixel).toBeLessThan(firstZone.pixelStart);
    expect(pixelToYear(pixel, realZones)).toBe(yearBeforeRange);
  });

  it("extrapolates using the nearest boundary zone's rate for years after the last zone, and round-trips exactly", () => {
    const lastZone = realZones[realZones.length - 1];
    const yearAfterRange = lastZone.yearEnd + 1000;

    const pixel = yearToPixel(yearAfterRange, realZones);

    expect(pixel).toBeGreaterThan(lastZone.pixelEnd);
    expect(pixelToYear(pixel, realZones)).toBe(yearAfterRange);
  });

  it("returns the zone start pixel for a zero-year-span zone (degenerate fraction branch)", () => {
    const zones: DensityZone[] = [
      { eraId: "point", yearStart: 1000, yearEnd: 1000, pxPerYear: 5, pixelStart: 50, pixelEnd: 50 },
    ];

    expect(yearToPixel(1000, zones)).toBe(50);
  });

  it("throws on an empty zones array", () => {
    expect(() => yearToPixel(2000, [])).toThrow();
  });

  it("falls back to the last zone for a year in a gap between non-contiguous zones", () => {
    const zones: DensityZone[] = [
      { eraId: "left", yearStart: 0, yearEnd: 100, pxPerYear: 1, pixelStart: 0, pixelEnd: 100 },
      { eraId: "right", yearStart: 200, yearEnd: 300, pxPerYear: 1, pixelStart: 200, pixelEnd: 300 },
    ];

    // year 150 matches neither zone's [yearStart, yearEnd) range: falls through
    // the loop and clamps to the last zone per findZoneIndexForYear's fallback,
    // extrapolating from that zone's rate (150 is below its yearStart of 200).
    expect(yearToPixel(150, zones)).toBe(150);
  });
});

describe("pixelToYear", () => {
  it("throws on an empty zones array", () => {
    expect(() => pixelToYear(100, [])).toThrow();
  });

  it("clamps pixels below the first zone to the first zone (nearest-boundary fallback)", () => {
    const firstZone = realZones[0];
    const pxBeforeRange = firstZone.pixelStart - 10_000_000;

    const year = pixelToYear(pxBeforeRange, realZones);

    expect(year).toBeLessThan(firstZone.yearStart);
  });

  it("clamps pixels above the last zone to the last zone (nearest-boundary fallback)", () => {
    const lastZone = realZones[realZones.length - 1];
    const pxAfterRange = lastZone.pixelEnd + 10_000_000;

    const year = pixelToYear(pxAfterRange, realZones);

    expect(year).toBeGreaterThan(lastZone.yearEnd);
  });

  it("returns the zone's historical start year for a zero-pixel-span zone (degenerate fraction branch)", () => {
    const zones: DensityZone[] = [
      { eraId: "point", yearStart: 1000, yearEnd: 1005, pxPerYear: 0, pixelStart: 75, pixelEnd: 75 },
    ];

    expect(pixelToYear(75, zones)).toBe(1000);
  });

  it("rounds a fractional astronomical year to the nearest integer year", () => {
    const zones: DensityZone[] = [
      { eraId: "era", yearStart: 0, yearEnd: 10, pxPerYear: 10, pixelStart: 0, pixelEnd: 100 },
    ];

    // px=25 -> fraction 0.25 -> astronomical year 0 + 0.25*(9-0) = 2.25 -> rounds to 2 -> historical year 3
    const year = pixelToYear(25, zones);
    expect(Number.isInteger(year)).toBe(true);
    expect(year).toBe(3);
  });

  it("falls back to the last zone for a pixel in a gap between non-contiguous zones", () => {
    const zones: DensityZone[] = [
      { eraId: "left", yearStart: 0, yearEnd: 100, pxPerYear: 1, pixelStart: 0, pixelEnd: 100 },
      { eraId: "right", yearStart: 200, yearEnd: 300, pxPerYear: 1, pixelStart: 200, pixelEnd: 300 },
    ];

    // px 150 matches neither zone's [pixelStart, pixelEnd) range: falls through
    // the loop and clamps to the last zone per findZoneIndexForPixel's fallback.
    expect(pixelToYear(150, zones)).toBe(150);
  });
});

describe("round-trip pixelToYear(yearToPixel(year, zones), zones) === year", () => {
  it("round-trips exactly for representative years (start/midpoint/end-1) across every real era", () => {
    for (const era of sortedRealEras) {
      const midpoint = Math.floor((era.yearStart + era.yearEnd) / 2);
      const sampleYears = [era.yearStart, midpoint, era.yearEnd - 1];

      for (const year of sampleYears) {
        const pixel = yearToPixel(year, realZones);
        expect(pixelToYear(pixel, realZones), `era ${era.id}, year ${year}`).toBe(year);
      }
    }
  });

  it("round-trips exactly for every show's narrativeYearStart, including BC dates", () => {
    for (const show of shows) {
      const pixel = yearToPixel(show.narrativeYearStart, realZones);
      expect(pixelToYear(pixel, realZones), show.id).toBe(show.narrativeYearStart);
    }
  });

  it("round-trips exactly at the final zone's yearEnd (last-zone inclusive boundary)", () => {
    const lastZone = realZones[realZones.length - 1];
    const pixel = yearToPixel(lastZone.yearEnd, realZones);
    expect(pixelToYear(pixel, realZones)).toBe(lastZone.yearEnd);
  });
});
