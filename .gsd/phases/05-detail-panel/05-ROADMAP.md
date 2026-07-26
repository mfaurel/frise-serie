# M005: Detail Panel

**Vision:** Build the show detail panel with two modes: bottom sheet (click from timeline) and modal popin (deep link via URL), displaying historical synopsis, streaming links, accuracy score, similar shows, and Wikipedia link.

## Success Criteria

- Bottom sheet slides up on card click with show details
- Modal popin opens on direct URL navigation (e.g., /fr/show/vikings)
- Detail panel shows: poster, title, dates, historical synopsis, accuracy stars, platform links, Wikipedia link, similar shows
- Escape key and overlay click close the panel
- Focus is trapped in panel when open, returns to card on close
- Panel content is bilingual (FR/EN based on locale)

## Slices

- [ ] **S01: Bottom sheet detail panel** `[sketch]` `risk:medium` `depends:[]`
  > After this: Click a show card, bottom sheet slides up with full show details. Escape closes it. Focus trapping works.

- [ ] **S02: Deep link popin modal** `[sketch]` `risk:medium` `depends:[S01]`
  > After this: Navigate to /fr/show/vikings directly — modal opens with Vikings details over the timeline.

## Boundary Map

Not provided.
