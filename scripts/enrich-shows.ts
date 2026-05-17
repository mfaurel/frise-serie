/**
 * Enrichment script: fetches TMDB data for all shows that have a tmdbId
 * and writes updated poster URLs + IMDB IDs back to data/shows.ts.
 *
 * Usage:
 *   TMDB_API_KEY=<your_key> npm run enrich
 *
 * A free TMDB API key is available at https://www.themoviedb.org/settings/api
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fetchShowById, posterUrl } from '../lib/tmdb';

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error('Missing TMDB_API_KEY environment variable.');
  process.exit(1);
}

// We dynamically import to avoid tsx compilation issues with path aliases
const showsPath = join(process.cwd(), 'data', 'shows.ts');
let source = readFileSync(showsPath, 'utf-8');

// Simple regex-based poster URL updater — replace known placeholder URLs
async function run() {
  // Extract tmdbId and current posterUrl pairs from source
  const idMatches = Array.from(source.matchAll(/tmdbId:\s*(\d+)/g));
  console.log(`Found ${idMatches.length} shows with tmdbId`);

  const results: { tmdbId: number; posterPath: string; imdbId: string }[] = [];

  for (const match of idMatches) {
    const tmdbId = Number(match[1]);
    try {
      const details = await fetchShowById(tmdbId, API_KEY!);
      const path = details.poster_path ? posterUrl(details.poster_path, 'w342') : '';
      const imdbId = details.external_ids?.imdb_id ?? '';
      console.log(`  ${details.name} (${tmdbId}) → ${path}`);
      results.push({ tmdbId, posterPath: path, imdbId });
      // Polite rate limiting
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.warn(`  Failed for tmdbId=${tmdbId}:`, err);
    }
  }

  // Write a JSON sidecar so the app can optionally load enriched data at build time
  const sidecarPath = join(process.cwd(), 'data', 'shows-enriched.json');
  writeFileSync(sidecarPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nWrote enriched data to ${sidecarPath}`);
  console.log('Run `npm run build` to rebuild with updated posters.');
}

run().catch(console.error);
