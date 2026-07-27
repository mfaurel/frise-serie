# M006: Filters, Search, and Navigation

**Vision:** Build the filter panel (region, genre, platform, accuracy), client-side text search, sidebar era navigation with quick-jump, and the top navigation bar — all wired to nuqs URL state with soft-collapse density behavior.

## Slices

- [ ] **S01: Filter panel with nuqs URL state** `[sketch]` `risk:medium` `depends:[]`
  > After this: Open filter panel, select 'europe_west' region — URL updates to ?region=europe_west, only European shows visible

- [ ] **S02: Soft-collapse density and search** `[sketch]` `risk:high` `depends:[S01]`
  > After this: Filter to 'asia' region — European eras collapse to 200px with 'no matches' label. Search 'Vikings' highlights matching card.

- [ ] **S03: Navigation bar and sidebar era quick-jump** `[sketch]` `risk:low` `depends:[S01]`
  > After this: Sidebar shows era list with show counts. Click 'Renaissance' — timeline scrolls to that era. Top bar has logo, filter toggle, locale switch.

## Boundary Map

Not provided.
