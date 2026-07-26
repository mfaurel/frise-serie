import { describe, expect, it } from "vitest";
import { yearToDisplay } from "@/lib/yearToDisplay";

describe("yearToDisplay", () => {
  it("formats the roadmap demo year (-73) in French", () => {
    expect(yearToDisplay(-73, "fr")).toBe("73 av. J.-C.");
  });

  it("formats the roadmap demo year (-73) in English", () => {
    expect(yearToDisplay(-73, "en")).toBe("73 BC");
  });

  it("formats a large BC year (-3000) per the TECHNICAL.md spec table", () => {
    expect(yearToDisplay(-3000, "fr")).toBe("3000 av. J.-C.");
    expect(yearToDisplay(-3000, "en")).toBe("3000 BC");
  });

  it("formats year 0 as the 1st century edge case in French", () => {
    expect(yearToDisplay(0, "fr")).toBe("Ier s.");
  });

  it("formats year 0 as the 1st century edge case in English", () => {
    expect(yearToDisplay(0, "en")).toBe("1st c.");
  });

  it("passes positive AD years through unchanged in French", () => {
    expect(yearToDisplay(1492, "fr")).toBe("1492");
  });

  it("passes positive AD years through unchanged in English", () => {
    expect(yearToDisplay(1492, "en")).toBe("1492");
  });

  it("passes through year 1 (the first AD year, no year zero) unchanged", () => {
    expect(yearToDisplay(1, "fr")).toBe("1");
    expect(yearToDisplay(1, "en")).toBe("1");
  });

  it("formats -1 (the last BC year, no year zero) distinctly from year 0", () => {
    expect(yearToDisplay(-1, "fr")).toBe("1 av. J.-C.");
    expect(yearToDisplay(-1, "en")).toBe("1 BC");
  });

  it("handles a small BC year", () => {
    expect(yearToDisplay(-5, "fr")).toBe("5 av. J.-C.");
    expect(yearToDisplay(-5, "en")).toBe("5 BC");
  });

  it("handles a far-future positive year unchanged", () => {
    expect(yearToDisplay(2024, "fr")).toBe("2024");
    expect(yearToDisplay(2024, "en")).toBe("2024");
  });
});
