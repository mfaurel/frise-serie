/** TMDB API helpers — used both by the enrich script and optionally at runtime */

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TmdbShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  origin_country: string[];
  original_language: string;
  vote_average: number;
  external_ids?: { imdb_id: string | null };
}

export function posterUrl(path: string, size: 'w92' | 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string {
  return `${IMAGE_BASE}/${size}${path}`;
}

export async function fetchShowById(tmdbId: number, apiKey: string): Promise<TmdbShowDetails> {
  const url = `${BASE_URL}/tv/${tmdbId}?api_key=${apiKey}&append_to_response=external_ids`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status} for id=${tmdbId}`);
  return res.json() as Promise<TmdbShowDetails>;
}

export async function searchShow(query: string, apiKey: string): Promise<TmdbShowDetails[]> {
  const url = `${BASE_URL}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB search ${res.status}`);
  const data = (await res.json()) as { results: TmdbShowDetails[] };
  return data.results;
}
