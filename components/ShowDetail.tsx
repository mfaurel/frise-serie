'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import type { Show, Locale } from '@/types';
import { formatYear } from '@/lib/timeline';
import { PLATFORM_COLORS, PLATFORM_LABELS, GENRE_LABELS, REGION_LABELS } from '@/lib/constants';

interface Props {
  show: Show | null;
  locale: Locale;
  onClose: () => void;
}

const ACCURACY_INFO: Record<number, { label: { fr: string; en: string }; color: string }> = {
  1: { label: { fr: 'Fantaisie — très peu de faits réels', en: 'Fantasy — very few real facts' }, color: '#f87171' },
  2: { label: { fr: 'Romancé — quelques bases historiques', en: 'Romanticised — some historical basis' }, color: '#fb923c' },
  3: { label: { fr: 'Inspiré — mélange de faits et de fiction', en: 'Inspired — mix of fact and fiction' }, color: '#facc15' },
  4: { label: { fr: 'Fidèle — solide en faits historiques', en: 'Faithful — solid historical facts' }, color: '#a3e635' },
  5: { label: { fr: 'Docu-fiction — très haute fidélité', en: 'Docudrama — very high fidelity' }, color: '#34d399' },
};

export default function ShowDetail({ show, locale, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!show) return null;

  const accuracy = ACCURACY_INFO[show.historicalAccuracyScore];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-950 border-l border-stone-700 z-50 overflow-y-auto animate-slide-in"
        role="complementary"
        aria-label={show.title[locale]}
      >
        {/* Header */}
        <div className="relative">
          {show.posterUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={show.posterUrl}
                alt={show.title[locale]}
                fill
                className="object-cover object-top"
                unoptimized
                sizes="448px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/80 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-8 -mt-8 relative">
          {/* Title */}
          <h2 className="text-2xl font-serif font-bold text-white mb-1">{show.title[locale]}</h2>
          {show.title.original !== show.title[locale] && (
            <p className="text-stone-400 text-sm italic mb-3">{show.title.original}</p>
          )}

          {/* Narrative period */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 font-bold text-lg font-serif">
              {formatYear(show.narrativeYearStart, locale)}
              {show.narrativeYearEnd && show.narrativeYearEnd !== show.narrativeYearStart
                ? ` – ${formatYear(show.narrativeYearEnd, locale)}`
                : ''}
            </span>
            <span className="text-stone-500 text-xs">
              ({locale === 'fr' ? 'période narrative' : 'narrative period'})
            </span>
          </div>

          {/* Accuracy */}
          <div
            className="flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-lg"
            style={{ background: `${accuracy.color}15`, border: `1px solid ${accuracy.color}33` }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    background: n <= show.historicalAccuracyScore ? accuracy.color : '#374151',
                  }}
                />
              ))}
            </div>
            <span style={{ color: accuracy.color }} className="font-medium">
              {accuracy.label[locale]}
            </span>
          </div>

          {/* Historical context */}
          <div className="mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
              {locale === 'fr' ? 'Contexte historique' : 'Historical Context'}
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">{show.historicalContext[locale]}</p>
          </div>

          {/* Historical figures */}
          {show.historicalFigures.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                {locale === 'fr' ? 'Personnages historiques' : 'Historical Figures'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {show.historicalFigures.map((fig) => (
                  <span
                    key={fig}
                    className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700"
                  >
                    {fig}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Genres & Regions */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                {locale === 'fr' ? 'Genres' : 'Genres'}
              </h3>
              <div className="flex flex-wrap gap-1">
                {show.genres.map((g) => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800/40">
                    {GENRE_LABELS[g][locale]}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                {locale === 'fr' ? 'Régions' : 'Regions'}
              </h3>
              <div className="flex flex-wrap gap-1">
                {show.regions.map((r) => (
                  <span key={r} className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800/40">
                    {REGION_LABELS[r][locale]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
              {locale === 'fr' ? 'Où regarder' : 'Where to Watch'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {show.platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: PLATFORM_COLORS[p] }}
                >
                  {PLATFORM_LABELS[p]}
                </span>
              ))}
            </div>
          </div>

          {/* Broadcast info */}
          <div className="text-xs text-stone-500 mb-5">
            {locale === 'fr' ? 'Diffusion : ' : 'Broadcast: '}
            {show.broadcastYearStart}
            {show.broadcastYearEnd ? `–${show.broadcastYearEnd}` : '–'}
          </div>

          {/* Wikipedia link */}
          <a
            href={show.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 underline"
          >
            {locale === 'fr' ? 'En savoir plus sur cette période' : 'Learn more about this period'}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </aside>
    </>
  );
}
