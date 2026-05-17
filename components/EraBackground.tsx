'use client';

import { ERAS } from '@/data/eras';
import { yearToPixel } from '@/lib/timeline';
import { formatYear } from '@/lib/timeline';

interface Props {
  locale: 'fr' | 'en';
}

export default function EraBackground({ locale }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {ERAS.map((era) => {
        const left = yearToPixel(era.yearStart);
        const width = yearToPixel(era.yearEnd) - left;

        return (
          <div
            key={era.id}
            className="absolute top-0 bottom-0 flex flex-col justify-end pb-8"
            style={{
              left,
              width,
              background: `linear-gradient(135deg, ${era.gradient[0]}22, ${era.gradient[1]}44)`,
              borderRight: `1px solid ${era.gradient[1]}33`,
            }}
          >
            {/* Era label */}
            <div
              className="px-3 py-1 mx-3 rounded text-xs font-serif font-bold tracking-wider uppercase opacity-60 truncate"
              style={{ color: era.gradient[1] }}
            >
              {era.name[locale]}
            </div>
            <div
              className="px-3 text-xs opacity-30 truncate"
              style={{ color: era.gradient[1] }}
            >
              {formatYear(era.yearStart, locale)} – {formatYear(era.yearEnd, locale)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
