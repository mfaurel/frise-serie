'use client';

import { useState } from 'react';
import type { Show, Era } from '@/types';
import { yearToDisplay } from '@/lib/yearToDisplay';

// Grey 80×112 SVG encoded as a data URI — used when the poster URL fails to load
const GREY_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='112'%3E%3Crect width='80' height='112' fill='%23808080'/%3E%3C/svg%3E";

export interface ShowCardProps {
  show: Show;
  era: Era;
}

export default function ShowCard({ show, era }: ShowCardProps) {
  const [posterSrc, setPosterSrc] = useState(show.posterUrl);

  // Use the last (most vibrant) swatch in the era palette for the star-node glow
  const glowColor = era.colorPalette[era.colorPalette.length - 1];

  const narrativeLabel =
    show.narrativeYearEnd !== null
      ? `${yearToDisplay(show.narrativeYearStart, 'en')}–${yearToDisplay(show.narrativeYearEnd, 'en')}`
      : `${yearToDisplay(show.narrativeYearStart, 'en')}–`;

  const broadcastLabel =
    show.broadcastYearEnd !== null
      ? `${show.broadcastYearStart}–${show.broadcastYearEnd}`
      : `${show.broadcastYearStart}–`;

  return (
    <div
      data-testid="show-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 88,
        userSelect: 'none',
      }}
    >
      {/* Star-node: era-colored circle with radial glow (inspectable via box-shadow) */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: glowColor,
          boxShadow: `0 0 10px 5px ${glowColor}`,
          marginBottom: 6,
          flexShrink: 0,
        }}
      />

      {/* Poster — degrades to inline grey SVG data-URI on load error */}
      <img
        src={posterSrc}
        alt={show.title.en}
        onError={() => setPosterSrc(GREY_POSTER)}
        style={{
          width: 80,
          height: 112,
          objectFit: 'cover',
          borderRadius: 4,
          marginBottom: 4,
          display: 'block',
        }}
      />

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          marginBottom: 2,
          width: 88,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {show.title.en}
      </span>

      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
        {narrativeLabel}
      </span>

      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
        {broadcastLabel}
      </span>
    </div>
  );
}
