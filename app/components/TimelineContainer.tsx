'use client';

import { useRef, useCallback, useState } from 'react';
import { shows } from "@/data/shows";
import { eras } from "@/data/eras";
import { buildDensityZones } from "@/lib/density";
import { yearToPixel } from "@/lib/yearToPixel";
import { VIRTUAL_CANVAS_WIDTH } from "@/lib/constants";
import { computeSwimLaneLayout } from "@/lib/swimLane";
import { computeRelatedShows } from "@/lib/constellationLines";
import ShowCard from "@/app/components/ShowCard";
import ConstellationLayer from "@/app/components/ConstellationLayer";

export default function TimelineContainer() {
  const zones = buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH);
  const totalWidth = zones[zones.length - 1].pixelEnd;
  const layout = computeSwimLaneLayout(shows, zones);
  const relatedShows = computeRelatedShows(shows);

  const [hoveredShowId, setHoveredShowId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const axisLayerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !bgLayerRef.current || !axisLayerRef.current) return;
    const sl = scrollRef.current.scrollLeft;
    bgLayerRef.current.style.transform = `translateX(${sl * 0.7}px)`;
    axisLayerRef.current.style.transform = `translateX(${sl * 0.4}px)`;
  }, []);

  return (
    <div
      ref={scrollRef}
      data-testid="timeline-scroll"
      onScroll={handleScroll}
      className="overflow-x-auto w-full"
      style={{ height: '100vh' }}
    >
      <div
        data-testid="timeline-inner"
        style={{ width: totalWidth, height: '100%', position: 'relative' }}
      >
        {/* Layer 1: Background (0.3x visible speed) */}
        <div
          ref={bgLayerRef}
          data-testid="parallax-bg"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {eras.map((era) => {
            const left = yearToPixel(era.yearStart, zones);
            const width = yearToPixel(era.yearEnd, zones) - left;
            return (
              <div
                key={era.id}
                data-testid="era-bg"
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  bottom: 0,
                  width,
                  background: `linear-gradient(to right, ${era.colorPalette.join(', ')})`,
                }}
              />
            );
          })}
        </div>

        {/* Layer 2: Axis (0.6x visible speed) */}
        <div
          ref={axisLayerRef}
          data-testid="parallax-axis"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {eras.map((era) => {
            const px = yearToPixel(era.yearStart, zones);
            const label =
              era.yearStart < 0
                ? Math.abs(era.yearStart) + " BC"
                : era.yearStart + " AD";
            return (
              <span
                key={era.id}
                data-testid="year-label"
                style={{ position: 'absolute', left: px, top: 8 }}
                className="text-xs text-white/70 select-none"
              >
                {label}
              </span>
            );
          })}
        </div>

        {/* Layer 3: Constellation layer (SVG span bars + lines) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ConstellationLayer
            layout={layout}
            zones={zones}
            eras={eras}
            relatedShows={relatedShows}
            hoveredShowId={hoveredShowId}
            totalWidth={totalWidth}
          />
        </div>

        {/* Layer 4: Cards (1.0x visible speed) */}
        <div
          data-testid="parallax-cards"
          style={{ position: 'absolute', inset: 0 }}
        >
          {layout.map(({ show, left, top, lane: _lane }) => {
            const era = eras.find(
              (e) => show.narrativeYearStart >= e.yearStart && show.narrativeYearStart <= e.yearEnd
            ) ?? eras[0];
            return (
              <div
                key={show.id}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  transform: 'translateX(-44px)',
                }}
                onMouseEnter={() => setHoveredShowId(show.id)}
                onMouseLeave={() => setHoveredShowId(null)}
              >
                <ShowCard show={show} era={era} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
