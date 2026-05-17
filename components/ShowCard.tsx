'use client';

import Image from 'next/image';
import type { Show, Locale } from '@/types';
import { formatYear } from '@/lib/timeline';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/constants';

interface Props {
  show: Show;
  locale: Locale;
  onClick: (show: Show) => void;
}

const ACCURACY_COLORS: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-lime-400',
  5: 'text-emerald-400',
};

const ACCURACY_LABELS: Record<number, { fr: string; en: string }> = {
  1: { fr: 'Fantaisie', en: 'Fantasy' },
  2: { fr: 'Romancé', en: 'Romanticised' },
  3: { fr: 'Inspiré', en: 'Inspired' },
  4: { fr: 'Fidèle', en: 'Faithful' },
  5: { fr: 'Documentaire', en: 'Docudrama' },
};

export default function ShowCard({ show, locale, onClick }: Props) {
  const platform = show.platforms[0];

  return (
    <div
      className="show-card group relative w-28 rounded-lg overflow-hidden bg-stone-900 border border-stone-700 hover:border-amber-500/60"
      onClick={() => onClick(show)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(show)}
      aria-label={show.title[locale]}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full bg-stone-800">
        {show.posterUrl ? (
          <Image
            src={show.posterUrl}
            alt={show.title[locale]}
            fill
            className="object-cover"
            unoptimized
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs text-center px-2">
            {show.title[locale]}
          </div>
        )}

        {/* Platform badge */}
        {platform && (
          <div
            className="absolute top-1 right-1 text-xs px-1 rounded font-bold"
            style={{
              background: PLATFORM_COLORS[platform] ?? '#374151',
              color: '#fff',
              fontSize: '9px',
            }}
          >
            {PLATFORM_LABELS[platform]}
          </div>
        )}

        {/* Accuracy dot */}
        <div
          className={`absolute bottom-1 left-1 w-2 h-2 rounded-full ${ACCURACY_COLORS[show.historicalAccuracyScore]}`}
          title={ACCURACY_LABELS[show.historicalAccuracyScore][locale]}
          style={{ boxShadow: '0 0 4px currentColor' }}
        />
      </div>

      {/* Info strip */}
      <div className="p-1.5">
        <div className="text-xs font-semibold leading-tight text-stone-200 truncate">
          {show.title[locale]}
        </div>
        <div className="text-xs text-stone-400 mt-0.5">
          {formatYear(show.narrativeYearStart, locale)}
          {show.narrativeYearEnd && show.narrativeYearEnd !== show.narrativeYearStart
            ? ` – ${formatYear(show.narrativeYearEnd, locale)}`
            : ''}
        </div>
      </div>
    </div>
  );
}
