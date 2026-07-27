# M002: Parallax Engine and Era Backgrounds

**Vision:** Build the horizontal-scroll parallax engine with 3 layers (background 0.3x, axis 0.6x, cards 1.0x) and era-specific nebula gradient backgrounds using the V5-atlas-editorial dark void palette.

## Slices

- [x] **S01: Next.js project scaffold with App Router and static export** `risk:low` `depends:[]`
  > After this: npm run build produces static HTML in out/, dev server runs at localhost:3000

- [ ] **S02: Horizontal scroll container with yearToPixel width** `risk:medium` `depends:[S01]`
  > After this: Timeline container scrolls horizontally, total width matches sum of density zones, year axis labels appear at correct positions

- [ ] **S03: 3-layer parallax with era nebula backgrounds** `[sketch]` `risk:high` `depends:[S02]`
  > After this: Scrolling shows background layer at 0.3x, axis at 0.6x, card layer at 1.0x. Each era has distinct nebula gradient colors.

## Boundary Map

Not provided.
