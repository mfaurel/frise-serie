import { describe, expect, it } from "vitest";
import {
  computeSwimLaneLayout,
  BASE_TOP,
  LANE_HEIGHT,
} from "@/lib/swimLane";
import type { DensityZone, Show } from "@/types";
import { buildDensityZones } from "@/lib/density";
import { shows } from "@/data/shows";
import { eras } from "@/data/eras";
import { VIRTUAL_CANVAS_WIDTH } from "@/lib/constants";

// yearToPixel(y, stubZones) = y - 1 for y in [1, 10001]
// so use year = targetLeft + 1 when constructing test shows
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

function makeStubShow(id: string, year: number): Show {
  return {
    id,
    title: { fr: id, en: id, original: id },
    posterUrl: "",
    narrativeYearStart: year,
    narrativeYearEnd: null,
    broadcastYearStart: year,
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

describe("computeSwimLaneLayout", () => {
  it("integration smoke: runs against real shows without throwing", () => {
    const zones = buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH);
    const result = computeSwimLaneLayout(shows, zones);
    expect(result).toHaveLength(shows.length);
  });

  it("non-overlapping shows all go to lane 0", () => {
    // years 1, 201, 401 → left 0, 200, 400; gap 200 > CARD_WIDTH 88
    const zones = makeStubZones();
    const result = computeSwimLaneLayout(
      [makeStubShow("a", 1), makeStubShow("b", 201), makeStubShow("c", 401)],
      zones,
    );
    expect(result.every((r) => r.lane === 0)).toBe(true);
  });

  it("two overlapping shows use lanes 0 and 1", () => {
    // years 1, 51 → left 0, 50; gap 50 < CARD_WIDTH 88
    const zones = makeStubZones();
    const result = computeSwimLaneLayout(
      [makeStubShow("a", 1), makeStubShow("b", 51)],
      zones,
    );
    expect(result[0].lane).toBe(0);
    expect(result[1].lane).toBe(1);
  });

  it("third show reuses lane 0 after clearing", () => {
    // years 1, 51, 201 → left 0, 50, 200; cardLeft(200)=156 >= laneEnds[0]=44
    const zones = makeStubZones();
    const result = computeSwimLaneLayout(
      [makeStubShow("a", 1), makeStubShow("b", 51), makeStubShow("c", 201)],
      zones,
    );
    expect(result[0].lane).toBe(0);
    expect(result[1].lane).toBe(1);
    expect(result[2].lane).toBe(0);
  });

  it("output is sorted by left ascending", () => {
    // Input in reverse order; returned array must be ascending by left
    const zones = makeStubZones();
    const result = computeSwimLaneLayout(
      [makeStubShow("c", 401), makeStubShow("b", 201), makeStubShow("a", 1)],
      zones,
    );
    expect(result[0].show.id).toBe("a");
    expect(result[1].show.id).toBe("b");
    expect(result[2].show.id).toBe("c");
    for (let i = 1; i < result.length; i++) {
      expect(result[i].left).toBeGreaterThanOrEqual(result[i - 1].left);
    }
  });

  it("top is BASE_TOP + lane * LANE_HEIGHT", () => {
    // lane 0 → top === 120; lane 1 → top === 120 + 196 === 316
    const zones = makeStubZones();
    const result = computeSwimLaneLayout(
      [makeStubShow("a", 1), makeStubShow("b", 51)],
      zones,
    );
    expect(result[0].top).toBe(BASE_TOP);
    expect(result[1].top).toBe(BASE_TOP + LANE_HEIGHT);
  });
});
