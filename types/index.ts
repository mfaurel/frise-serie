export type Genre =
  | 'peplum'
  | 'medieval'
  | 'renaissance'
  | 'revolution'
  | 'war'
  | 'biopic'
  | 'western'
  | 'colonial'
  | 'ancient_east'
  | 'cold_war'
  | '20th_century'
  | 'contemporary'
  | 'viking'
  | 'pirate'
  | 'empire';

export type Region =
  | 'europe_west'
  | 'europe_east'
  | 'mediterranean'
  | 'middle_east'
  | 'asia_east'
  | 'asia_south'
  | 'africa'
  | 'americas_north'
  | 'americas_south'
  | 'oceania'
  | 'nordic';

export type Platform =
  | 'netflix'
  | 'prime_video'
  | 'disney_plus'
  | 'apple_tv'
  | 'max'
  | 'canal_plus'
  | 'arte'
  | 'other';

export interface Flashback {
  narrativeYearStart: number;
  narrativeYearEnd: number;
  description: { fr: string; en: string };
}

export interface Show {
  id: string;
  title: { fr: string; en: string; original: string };
  posterUrl: string;
  /** Story start year — negative = BC */
  narrativeYearStart: number;
  narrativeYearEnd: number | null;
  broadcastYearStart: number;
  broadcastYearEnd: number | null;
  /** 1 = pure fantasy, 5 = docudrama */
  historicalAccuracyScore: 1 | 2 | 3 | 4 | 5;
  genres: Genre[];
  regions: Region[];
  platforms: Platform[];
  flashbacks: Flashback[];
  historicalContext: { fr: string; en: string };
  historicalFigures: string[];
  wikipediaUrl: string;
  trailerUrl?: string;
  languages: string[];
  tmdbId?: number;
  imdbId?: string;
}

export interface HistoricalEvent {
  year: number;
  name: { fr: string; en: string };
  emoji: string;
}

export interface HistoricalEra {
  id: string;
  name: { fr: string; en: string };
  yearStart: number;
  yearEnd: number;
  pixelsPerYear: number;
  gradient: [string, string];
  textColor: string;
  description: { fr: string; en: string };
  keyEvents: HistoricalEvent[];
}

export type Locale = 'fr' | 'en';

export interface FilterState {
  regions: Region[];
  genres: Genre[];
  platforms: Platform[];
  minAccuracy: number;
  search: string;
}
