'use client';

import { yearToPixel } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import type { Locale } from '@/types';

interface Props {
  zoom: number;
  locale: Locale;
  ticks: number[];
  currentYear: number; // TODO: render current-year marker in Phase 6
}

export default function AxisLayer({ zoom, locale, ticks }: Props) {
  return (
    <div className="absolute left-0 right-0" style={{ top: 48 }}>
      {/* Axis line */}
      <div className="absolute h-px bg-stone-600/60" style={{ left: 0, right: 0, top: 16 }} />

      {/* Ticks */}
      {ticks.map((year) => {
        const x = yearToPixel(year) * zoom;
        const isCentury = year % 100 === 0;
        const is500 = year % 500 === 0;
        return (
          <div key={year} className="absolute flex flex-col items-center" style={{ left: x, transform: 'translateX(-50%)' }}>
            <div
              className={`w-px ${isCentury ? 'h-4 bg-stone-400' : 'h-2 bg-stone-600'}`}
              style={{ marginTop: is500 ? 0 : isCentury ? 4 : 8 }}
            />
            {isCentury && (
              <span className={`text-xs mt-0.5 font-mono ${is500 ? 'text-amber-500 font-bold text-sm' : 'text-stone-500'}`}>
                {yearToDisplay(year, locale)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
