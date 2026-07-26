export type Genre =
  | "peplum"
  | "medieval"
  | "renaissance"
  | "revolution"
  | "war"
  | "biopic"
  | "western"
  | "colonial"
  | "ancient_east"
  | "cold_war"
  | "20th_century"
  | "contemporary";

export type Region =
  | "europe_west"
  | "europe_east"
  | "mediterranean"
  | "middle_east"
  | "asia_east"
  | "asia_south"
  | "africa"
  | "americas_north"
  | "americas_south"
  | "oceania";

export type Platform =
  | "netflix"
  | "prime_video"
  | "disney_plus"
  | "apple_tv"
  | "max"
  | "canal_plus"
  | "arte"
  | "other";

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface Flashback {
  narrativeYearStart: number;
  narrativeYearEnd: number;
  description: LocalizedString;
}

export interface Show {
  id: string;
  title: {
    fr: string;
    en: string;
    original: string;
  };
  posterUrl: string;
  narrativeYearStart: number;
  narrativeYearEnd: number | null;
  broadcastYearStart: number;
  broadcastYearEnd: number | null;
  historicalAccuracyScore: 1 | 2 | 3 | 4 | 5;
  genres: Genre[];
  regions: Region[];
  platforms: Platform[];
  flashbacks: Flashback[];
  historicalContext: LocalizedString;
  historicalFigures: string[];
  wikipediaUrl: string;
  trailerUrl?: string;
  languages: string[];
  countryAvailability: string[];
}

export interface HistoricalEvent {
  year: number;
  name: LocalizedString;
  iconUrl?: string;
}

export interface Era {
  id: string;
  name: LocalizedString;
  yearStart: number;
  yearEnd: number;
  colorPalette: string[];
  backgroundAssetUrl: string;
  description: LocalizedString;
  keyEvents: HistoricalEvent[];
}

export interface DensityZone {
  eraId: string;
  yearStart: number;
  yearEnd: number;
  pxPerYear: number;
  pixelStart: number;
  pixelEnd: number;
}
