import { describe, expect, it } from "vitest";
import { shows } from "@/data/shows";
import { eras } from "@/data/eras";
import { events } from "@/data/events";
import type { Genre, Platform, Region } from "@/types";

const GENRES: Genre[] = [
  "peplum",
  "medieval",
  "renaissance",
  "revolution",
  "war",
  "biopic",
  "western",
  "colonial",
  "ancient_east",
  "cold_war",
  "20th_century",
  "contemporary",
];

const REGIONS: Region[] = [
  "europe_west",
  "europe_east",
  "mediterranean",
  "middle_east",
  "asia_east",
  "asia_south",
  "africa",
  "americas_north",
  "americas_south",
  "oceania",
];

const PLATFORMS: Platform[] = [
  "netflix",
  "prime_video",
  "disney_plus",
  "apple_tv",
  "max",
  "canal_plus",
  "arte",
  "other",
];

describe("data quantity requirements", () => {
  it("has at least 50 shows", () => {
    expect(shows.length).toBeGreaterThanOrEqual(50);
  });

  it("has at least 6 eras", () => {
    expect(eras.length).toBeGreaterThanOrEqual(6);
  });

  it("has at least 20 historical events", () => {
    expect(events.length).toBeGreaterThanOrEqual(20);
  });
});

describe("show field completeness and types", () => {
  it("every show has a unique non-empty id", () => {
    const ids = shows.map((show) => show.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every show has complete localized title and historical context", () => {
    for (const show of shows) {
      expect(show.title.fr.length, `${show.id} title.fr`).toBeGreaterThan(0);
      expect(show.title.en.length, `${show.id} title.en`).toBeGreaterThan(0);
      expect(show.title.original.length, `${show.id} title.original`).toBeGreaterThan(0);
      expect(show.historicalContext.fr.length, `${show.id} historicalContext.fr`).toBeGreaterThan(0);
      expect(show.historicalContext.en.length, `${show.id} historicalContext.en`).toBeGreaterThan(0);
    }
  });

  it("every show has a valid historicalAccuracyScore between 1 and 5", () => {
    for (const show of shows) {
      expect(show.historicalAccuracyScore, show.id).toBeGreaterThanOrEqual(1);
      expect(show.historicalAccuracyScore, show.id).toBeLessThanOrEqual(5);
      expect(Number.isInteger(show.historicalAccuracyScore), show.id).toBe(true);
    }
  });

  it("every show has at least one genre, region, and platform, all from the known enums", () => {
    for (const show of shows) {
      expect(show.genres.length, `${show.id} genres`).toBeGreaterThan(0);
      expect(show.regions.length, `${show.id} regions`).toBeGreaterThan(0);
      expect(show.platforms.length, `${show.id} platforms`).toBeGreaterThan(0);
      for (const genre of show.genres) {
        expect(GENRES, `${show.id} genre "${genre}"`).toContain(genre);
      }
      for (const region of show.regions) {
        expect(REGIONS, `${show.id} region "${region}"`).toContain(region);
      }
      for (const platform of show.platforms) {
        expect(PLATFORMS, `${show.id} platform "${platform}"`).toContain(platform);
      }
    }
  });

  it("every show has non-empty languages, countryAvailability, wikipediaUrl, and posterUrl", () => {
    for (const show of shows) {
      expect(show.languages.length, `${show.id} languages`).toBeGreaterThan(0);
      expect(show.countryAvailability.length, `${show.id} countryAvailability`).toBeGreaterThan(0);
      expect(show.wikipediaUrl.length, `${show.id} wikipediaUrl`).toBeGreaterThan(0);
      expect(show.posterUrl.length, `${show.id} posterUrl`).toBeGreaterThan(0);
    }
  });

  it("every show's historicalFigures and flashbacks are arrays (possibly empty)", () => {
    for (const show of shows) {
      expect(Array.isArray(show.historicalFigures), show.id).toBe(true);
      expect(Array.isArray(show.flashbacks), show.id).toBe(true);
    }
  });
});

describe("BC date handling", () => {
  it("supports negative (BC) narrativeYearStart/End as plain numbers", () => {
    const spartacus = shows.find((show) => show.id === "spartacus");
    expect(spartacus).toBeDefined();
    expect(spartacus?.narrativeYearStart).toBe(-73);
    expect(spartacus?.narrativeYearEnd).toBe(-71);
    expect(Number.isNaN(spartacus?.narrativeYearStart)).toBe(false);
  });

  it("has at least one show and one era spanning BC years (negative years present)", () => {
    expect(shows.some((show) => show.narrativeYearStart < 0)).toBe(true);
    expect(eras.some((era) => era.yearStart < 0)).toBe(true);
    expect(events.some((event) => event.year < 0)).toBe(true);
  });

  it("narrativeYearEnd, when non-null, is greater than or equal to narrativeYearStart", () => {
    for (const show of shows) {
      if (show.narrativeYearEnd !== null) {
        expect(show.narrativeYearEnd, show.id).toBeGreaterThanOrEqual(show.narrativeYearStart);
      }
    }
  });

  it("broadcastYearEnd, when non-null, is greater than or equal to broadcastYearStart", () => {
    for (const show of shows) {
      if (show.broadcastYearEnd !== null) {
        expect(show.broadcastYearEnd, show.id).toBeGreaterThanOrEqual(show.broadcastYearStart);
      }
    }
  });

  it("allows null narrativeYearEnd and broadcastYearEnd for still-running shows", () => {
    expect(shows.some((show) => show.narrativeYearEnd === null)).toBe(true);
    expect(shows.some((show) => show.broadcastYearEnd === null)).toBe(true);
  });
});

describe("era integrity", () => {
  it("every era has a unique non-empty id", () => {
    const ids = eras.map((era) => era.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every era has yearStart strictly before yearEnd", () => {
    for (const era of eras) {
      expect(era.yearStart, era.id).toBeLessThan(era.yearEnd);
    }
  });

  it("every era has a non-empty colorPalette, backgroundAssetUrl, and localized description", () => {
    for (const era of eras) {
      expect(era.colorPalette.length, era.id).toBeGreaterThan(0);
      expect(era.backgroundAssetUrl.length, era.id).toBeGreaterThan(0);
      expect(era.description.fr.length, era.id).toBeGreaterThan(0);
      expect(era.description.en.length, era.id).toBeGreaterThan(0);
    }
  });

  it("eras are chronologically ordered and contiguous (no gaps or overlaps)", () => {
    const sorted = [...eras].sort((a, b) => a.yearStart - b.yearStart);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].yearStart, `${sorted[i].id} follows ${sorted[i - 1].id}`).toBe(
        sorted[i - 1].yearEnd,
      );
    }
  });
});

describe("event referential integrity", () => {
  const eraIds = new Set(eras.map((era) => era.id));

  it("every event's eraId matches an actual era id", () => {
    for (const event of events) {
      expect(eraIds.has(event.eraId), `event "${event.name.en}" eraId "${event.eraId}"`).toBe(true);
    }
  });

  it("every event has a localized name", () => {
    for (const event of events) {
      expect(event.name.fr.length, event.name.en).toBeGreaterThan(0);
      expect(event.name.en.length, event.name.en).toBeGreaterThan(0);
    }
  });

  it("every event's year falls within its era's year range", () => {
    const eraById = new Map(eras.map((era) => [era.id, era]));
    for (const event of events) {
      const era = eraById.get(event.eraId);
      expect(era, `era for event "${event.name.en}"`).toBeDefined();
      if (era) {
        expect(event.year, `event "${event.name.en}" in era "${era.id}"`).toBeGreaterThanOrEqual(
          era.yearStart,
        );
        expect(event.year, `event "${event.name.en}" in era "${era.id}"`).toBeLessThanOrEqual(
          era.yearEnd,
        );
      }
    }
  });

  it("every era's keyEvents contains only events matching its own eraId", () => {
    for (const era of eras) {
      for (const keyEvent of era.keyEvents) {
        const matching = events.find(
          (event) => event.year === keyEvent.year && event.name.en === keyEvent.name.en,
        );
        expect(matching?.eraId, `keyEvent "${keyEvent.name.en}" in era "${era.id}"`).toBe(era.id);
      }
    }
  });
});

describe("negative / malformed input rejection (guards against future regressions)", () => {
  it("rejects an eraId that does not exist in eras (contrived event)", () => {
    const eraIds = new Set(eras.map((era) => era.id));
    const malformedEvent = { eraId: "does-not-exist", year: 1000, name: { fr: "x", en: "x" } };
    expect(eraIds.has(malformedEvent.eraId)).toBe(false);
  });

  it("flags a show with an out-of-range historicalAccuracyScore as invalid", () => {
    const isValidScore = (score: number) => Number.isInteger(score) && score >= 1 && score <= 5;
    expect(isValidScore(0)).toBe(false);
    expect(isValidScore(6)).toBe(false);
    expect(shows.every((show) => isValidScore(show.historicalAccuracyScore))).toBe(true);
  });

  it("flags an era whose yearEnd precedes yearStart as invalid", () => {
    const isValidRange = (yearStart: number, yearEnd: number) => yearStart < yearEnd;
    expect(isValidRange(2000, 1000)).toBe(false);
    expect(eras.every((era) => isValidRange(era.yearStart, era.yearEnd))).toBe(true);
  });
});
