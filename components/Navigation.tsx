'use client';

import type { Locale } from '@/types';
import FilterPanel from './FilterPanel';
import type { FilterState } from '@/types';

interface Props {
  locale: Locale;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onLocaleToggle: () => void;
}

export default function Navigation({ locale, filters, onFiltersChange, onLocaleToggle }: Props) {
  return (
    <header className="flex items-center gap-4 px-4 py-3 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 z-20 relative">
      {/* Logo / Title */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-2xl" aria-hidden="true">🏛️</span>
        <div>
          <h1 className="font-serif font-bold text-amber-400 leading-tight text-lg">
            {locale === 'fr' ? 'Frise Historique' : 'Historical Timeline'}
          </h1>
          <p className="text-xs text-stone-500 leading-none">
            {locale === 'fr' ? 'Séries & Histoire' : 'Series & History'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel filters={filters} onChange={onFiltersChange} locale={locale} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help hint */}
      <span className="hidden sm:block text-xs text-stone-600">
        {locale === 'fr' ? '← → pour naviguer • clic sur une série pour les détails' : '← → to navigate • click a show for details'}
      </span>

      {/* Locale toggle */}
      <button
        onClick={onLocaleToggle}
        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-sm font-bold transition-colors"
        title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      >
        {locale === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
      </button>
    </header>
  );
}
