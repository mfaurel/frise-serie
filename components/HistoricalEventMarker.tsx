'use client';

import { useState } from 'react';
import { ERAS } from '@/data/eras';
import { yearToPixel } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import type { Locale } from '@/types';

interface Props {
  locale: Locale;
}

export default function HistoricalEventMarkers({ locale }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const events = ERAS.flatMap((era) =>
    era.keyEvents.map((ev) => ({ ...ev, eraId: era.id, eraColor: era.gradient[1] }))
  );

  return (
    <>
      {events.map((ev) => {
        const key = `${ev.eraId}-${ev.year}`;
        const left = yearToPixel(ev.year);

        return (
          <div
            key={key}
            className="absolute flex flex-col items-center"
            style={{ left, top: 0, transform: 'translateX(-50%)' }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Vertical tick */}
            <div className="w-px h-4 opacity-50" style={{ background: ev.eraColor }} />
            {/* Emoji marker */}
            <div className="text-lg cursor-default" title={ev.name[locale]}>
              {ev.emoji}
            </div>

            {/* Tooltip */}
            {hovered === key && (
              <div
                className="absolute top-10 z-50 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
                style={{ background: '#1c1917', border: `1px solid ${ev.eraColor}44`, color: ev.eraColor }}
              >
                <div className="font-bold">{ev.name[locale]}</div>
                <div className="opacity-70">{yearToDisplay(ev.year, locale)}</div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
