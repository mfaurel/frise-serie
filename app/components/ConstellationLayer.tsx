'use client';

import type { Era, DensityZone } from "@/types";
import type { LaidOutShow } from "@/lib/swimLane";
import {
  computeSpanBars,
  computeConstellationSegments,
} from "@/lib/constellationLines";

interface Props {
  layout: LaidOutShow[];
  zones: DensityZone[];
  eras: Era[];
  relatedShows: Map<string, string[]>;
  hoveredShowId: string | null;
  totalWidth: number;
}

function findEraForYear(year: number, eras: Era[]): Era {
  return eras.find((e) => year >= e.yearStart && year <= e.yearEnd) ?? eras[0];
}

export default function ConstellationLayer({
  layout,
  zones,
  eras,
  relatedShows,
  hoveredShowId,
  totalWidth,
}: Props) {
  const spanBars = computeSpanBars(layout, zones, eras);
  const segments = computeConstellationSegments(layout, relatedShows);

  const showById = new Map(layout.map((item) => [item.show.id, item.show]));

  return (
    <svg
      data-testid="constellation-layer"
      style={{
        position: 'absolute',
        inset: 0,
        width: totalWidth,
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {spanBars.map((bar) => (
        <rect
          key={bar.showId}
          x={bar.x1}
          y={bar.y - 1}
          width={bar.x2 - bar.x1}
          height={2}
          fill={bar.color}
          opacity={hoveredShowId === null || hoveredShowId === bar.showId ? 0.8 : 0.2}
          data-testid="span-bar"
          data-show-id={bar.showId}
        />
      ))}
      {segments.map((seg) => {
        const { x1, y1, x2, y2 } = seg;
        const mx = (x1 + x2) / 2;
        const my = Math.min(y1, y2) - 40;
        const isActive =
          hoveredShowId === seg.showIdA || hoveredShowId === seg.showIdB;
        const opacity =
          hoveredShowId === null ? 0.15 : isActive ? 0.9 : 0.05;
        const showA = showById.get(seg.showIdA);
        const era = showA
          ? findEraForYear(showA.narrativeYearStart, eras)
          : eras[0];
        const stroke = era.colorPalette[era.colorPalette.length - 1];
        return (
          <path
            key={seg.key}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            stroke={stroke}
            strokeWidth={1}
            fill="none"
            opacity={opacity}
            data-testid="constellation-line"
            data-show-a={seg.showIdA}
            data-show-b={seg.showIdB}
          />
        );
      })}
    </svg>
  );
}
