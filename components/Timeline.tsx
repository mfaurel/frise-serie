'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import ShowCard from './ShowCard';
import AxisLayer from './AxisLayer';
import HistoricalEventMarkers from './HistoricalEventMarker';
import { SHOWS } from '@/data/shows';
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import { ERAS } from '@/data/eras';
import type { Show, FilterState, Locale } from '@/types';

const TIMELINE_START = ERAS[0].yearStart;
const TIMELINE_END = ERAS[ERAS.length - 1].yearEnd;

const TICK_INTERVALS = [100, 50, 25, 10];
const CARDS_TOP_OFFSET = 90; // px from top of the timeline track

interface Props {
  filters: FilterState;
  locale: Locale;
  onShowSelect: (show: Show) => void;
  backgroundLayer: React.ReactNode;
}

function getTickInterval(zoom: number): number {
  if (zoom > 3) return TICK_INTERVALS[3];
  if (zoom > 2) return TICK_INTERVALS[2];
  if (zoom > 1.2) return TICK_INTERVALS[1];
  return TICK_INTERVALS[0];
}

function applyFilters(shows: Show[], f: FilterState): Show[] {
  return shows.filter((s) => {
    if (f.search) {
      const q = f.search.toLowerCase();
      const match =
        s.title.fr.toLowerCase().includes(q) ||
        s.title.en.toLowerCase().includes(q) ||
        s.title.original.toLowerCase().includes(q) ||
        s.historicalFigures.some((h) => h.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (f.genres.length && !s.genres.some((g) => f.genres.includes(g))) return false;
    if (f.regions.length && !s.regions.some((r) => f.regions.includes(r))) return false;
    if (f.platforms.length && !s.platforms.some((p) => f.platforms.includes(p))) return false;
    if (s.historicalAccuracyScore < f.minAccuracy) return false;
    return true;
  });
}

/** Stagger cards vertically to avoid collision */
function assignRows(shows: Show[]): Map<string, number> {
  const sorted = [...shows].sort((a, b) => a.narrativeYearStart - b.narrativeYearStart);
  const rowEnds: number[] = [];
  const result = new Map<string, number>();
  const CARD_WIDTH_YEARS = 15;

  for (const show of sorted) {
    const startYear = show.narrativeYearStart;
    let row = 0;
    while (rowEnds[row] !== undefined && rowEnds[row] > startYear) {
      row++;
    }
    rowEnds[row] = startYear + CARD_WIDTH_YEARS;
    result.set(show.id, row);
  }
  return result;
}

export default function Timeline({ filters, locale, onShowSelect, backgroundLayer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [currentYear, setCurrentYear] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  const { scrollXProgress } = useScroll({ container: containerRef });

  // Parallax: background drifts at 70% of scroll speed (D-08 + D-09)
  const bgX = useTransform(scrollXProgress, [0, 1], [0, shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)]);

  const filteredShows = applyFilters(SHOWS, filters);
  const rowMap = assignRows(filteredShows);
  const maxRows = Math.max(0, ...Array.from(rowMap.values())) + 1;
  const CARD_HEIGHT = 180;
  const TRACK_HEIGHT = CARDS_TOP_OFFSET + maxRows * CARD_HEIGHT + 80;

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const year = Math.round(TIMELINE_START + scrollRatio * (TIMELINE_END - TIMELINE_START));
    setCurrentYear(year);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') el.scrollLeft += 120;
      if (e.key === 'ArrowLeft') el.scrollLeft -= 120;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const tickInterval = getTickInterval(zoom);
  const ticks: number[] = [];
  for (let y = TIMELINE_START; y <= TIMELINE_END; y += tickInterval) {
    ticks.push(y);
  }

  const totalScaledWidth = TOTAL_WIDTH * zoom;

  return (
    <div className="relative flex flex-col h-full">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur border border-stone-700 rounded-lg px-3 py-1.5">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-stone-700 text-stone-300 text-lg leading-none"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="text-xs text-stone-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-stone-700 text-stone-300 text-lg leading-none"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {/* Current year indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-stone-900/80 backdrop-blur border border-amber-700/40 rounded-full text-amber-400 font-serif font-bold text-sm pointer-events-none">
        {yearToDisplay(currentYear, locale)}
      </div>

      {/* Scrollable timeline */}
      <div
        ref={containerRef}
        className="timeline-scroll flex-1 overflow-x-auto overflow-y-hidden relative focus:outline-none"
        style={{ minHeight: TRACK_HEIGHT, touchAction: 'pan-x' }}
        tabIndex={0}
        aria-label={locale === 'fr' ? 'Frise chronologique — utilisez les flèches pour naviguer' : 'Timeline — use arrow keys to navigate'}
      >
        {/* Inner track */}
        <div
          className="relative"
          style={{ width: totalScaledWidth, height: TRACK_HEIGHT }}
        >
          {/* Parallax background layer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ x: bgX, scaleX: 1 / zoom, transformOrigin: 'left center' }}
          >
            <div style={{ width: totalScaledWidth, height: '100%', transform: `scaleX(${zoom})`, transformOrigin: 'left center' }}>
              {backgroundLayer}
            </div>
          </motion.div>

          {/* Time axis */}
          <AxisLayer zoom={zoom} locale={locale} ticks={ticks} currentYear={currentYear} />

          {/* Historical event markers */}
          <div className="absolute" style={{ top: 44, left: 0 }}>
            <HistoricalEventMarkers locale={locale} />
          </div>

          {/* Show cards */}
          <div data-layer="card-track">
            {filteredShows.map((show) => {
              const x = yearToPixel(show.narrativeYearStart) * zoom;
              const row = rowMap.get(show.id) ?? 0;
              const top = CARDS_TOP_OFFSET + row * CARD_HEIGHT;

              return (
                <div
                  key={show.id}
                  className="absolute"
                  style={{ left: x, top, transform: 'translateX(-14px)' }}
                >
                  {/* Anchor line from axis to card */}
                  <div
                    className="absolute w-px bg-stone-700/50"
                    style={{
                      left: 14,
                      bottom: '100%',
                      height: top - 64,
                      transformOrigin: 'bottom',
                    }}
                  />
                  <ShowCard show={show} locale={locale} onClick={onShowSelect} />
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredShows.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-stone-500 text-lg font-serif">
                {locale === 'fr' ? 'Aucune série ne correspond aux filtres.' : 'No shows match the current filters.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
