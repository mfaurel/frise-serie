'use client';

import { useState } from 'react';
import type { FilterState, Genre, Region, Platform, Locale } from '@/types';
import { GENRE_LABELS, REGION_LABELS, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/constants';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  locale: Locale;
}

const ALL_GENRES: Genre[] = [
  'peplum', 'medieval', 'renaissance', 'revolution', 'war',
  'biopic', 'viking', 'pirate', 'empire', 'western', 'colonial',
  'ancient_east', 'cold_war', '20th_century',
];

const ALL_REGIONS: Region[] = [
  'mediterranean', 'europe_west', 'europe_east', 'nordic',
  'middle_east', 'asia_east', 'asia_south',
  'africa', 'americas_north', 'americas_south',
];

const ALL_PLATFORMS: Platform[] = [
  'netflix', 'prime_video', 'disney_plus', 'apple_tv', 'max', 'canal_plus', 'arte', 'other',
];

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export default function FilterPanel({ filters, onChange, locale }: Props) {
  const [open, setOpen] = useState(false);

  const activeCount =
    filters.genres.length +
    filters.regions.length +
    filters.platforms.length +
    (filters.minAccuracy > 1 ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="relative z-30">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-sm font-medium transition-colors"
      >
        <span>{locale === 'fr' ? 'Filtres' : 'Filters'}</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <span className="text-stone-400">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-4 space-y-4 animate-fade-in">
          {/* Search */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              {locale === 'fr' ? 'Rechercher' : 'Search'}
            </label>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder={locale === 'fr' ? 'Titre, personnage…' : 'Title, figure…'}
              className="w-full px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-600 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Accuracy */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              {locale === 'fr' ? 'Fiabilité historique min.' : 'Min. Historical Accuracy'}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={filters.minAccuracy}
              onChange={(e) => onChange({ ...filters, minAccuracy: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-stone-500 mt-0.5">
              <span>{locale === 'fr' ? 'Fantaisie' : 'Fantasy'}</span>
              <span className="text-amber-400 font-bold">{filters.minAccuracy}/5</span>
              <span>{locale === 'fr' ? 'Docufiction' : 'Docudrama'}</span>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              {locale === 'fr' ? 'Plateformes' : 'Platforms'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PLATFORMS.map((p) => {
                const active = filters.platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => onChange({ ...filters, platforms: toggle(filters.platforms, p) })}
                    className="text-xs font-bold px-2 py-0.5 rounded-full transition-opacity"
                    style={{
                      background: active ? PLATFORM_COLORS[p] : '#292524',
                      color: active ? '#fff' : '#78716c',
                      border: `1px solid ${active ? PLATFORM_COLORS[p] : '#44403c'}`,
                    }}
                  >
                    {PLATFORM_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              {locale === 'fr' ? 'Genres' : 'Genres'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_GENRES.map((g) => {
                const active = filters.genres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => onChange({ ...filters, genres: toggle(filters.genres, g) })}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      active
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-amber-700'
                    }`}
                  >
                    {GENRE_LABELS[g][locale]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              {locale === 'fr' ? 'Régions' : 'Regions'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_REGIONS.map((r) => {
                const active = filters.regions.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => onChange({ ...filters, regions: toggle(filters.regions, r) })}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      active
                        ? 'bg-blue-700 text-white border-blue-500'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-blue-700'
                    }`}
                  >
                    {REGION_LABELS[r][locale]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <button
              onClick={() =>
                onChange({ genres: [], regions: [], platforms: [], minAccuracy: 1, search: '' })
              }
              className="w-full text-xs text-red-400 hover:text-red-300 py-1 border border-red-900/40 rounded-lg hover:bg-red-950/30 transition-colors"
            >
              {locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
