'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Timeline from '@/components/Timeline';
import ShowDetail from '@/components/ShowDetail';
import type { Show, FilterState, Locale } from '@/types';

const DEFAULT_FILTERS: FilterState = {
  genres: [],
  regions: [],
  platforms: [],
  minAccuracy: 1,
  search: '',
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  return (
    <div className="flex flex-col h-screen bg-stone-950 overflow-hidden">
      <Navigation
        locale={locale}
        filters={filters}
        onFiltersChange={setFilters}
        onLocaleToggle={() => setLocale((l) => (l === 'fr' ? 'en' : 'fr'))}
      />

      <main className="flex-1 overflow-hidden relative">
        <Timeline
          filters={filters}
          locale={locale}
          onShowSelect={setSelectedShow}
        />
      </main>

      <ShowDetail
        show={selectedShow}
        locale={locale}
        onClose={() => setSelectedShow(null)}
      />
    </div>
  );
}
