# M001: Data Foundation and yearToPixel

**Vision:** Establish the core data layer (typed show/era/event data) and the yearToPixel density algorithm that maps historical years to pixel positions — the critical-path blocker for all visual components.

## Success Criteria

- TypeScript interfaces for Show, Era, HistoricalEvent, Genre, Region, Platform match PRD data model
- Static data files with ~50 shows, 6+ eras, 20+ historical events
- yearToPixel and pixelToYear functions pass unit tests including BC dates, era boundaries, and density edge cases
- buildDensityZones produces correct non-linear mapping from show distribution
- yearToDisplay formats BC dates correctly in FR and EN
- All pure functions tested with Vitest — 100% branch coverage on yearToPixel

## Slices

- [ ] **S01: TypeScript types and static data files** `risk:low` `depends:[]`
  > After this: Import shows.ts and log all 50 shows with correct types — no compile errors

- [ ] **S02: yearToPixel density algorithm** `[sketch]` `risk:high` `depends:[S01]`
  > After this: Vitest suite passes: yearToPixel(793, zones) returns correct pixel for Vikings start, pixelToYear inverts it, BC dates work

- [ ] **S03: Year display formatting and filter utilities** `[sketch]` `risk:low` `depends:[S01]`
  > After this: yearToDisplay(-73, 'fr') returns '73 av. J.-C.', yearToDisplay(-73, 'en') returns '73 BC'

## Boundary Map

Not provided.
