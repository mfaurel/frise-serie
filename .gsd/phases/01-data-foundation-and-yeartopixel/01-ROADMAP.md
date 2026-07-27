# M001: Data Foundation and yearToPixel

**Vision:** Establish the core data layer (typed show/era/event data) and the yearToPixel density algorithm that maps historical years to pixel positions — the critical-path blocker for all visual components.

## Slices

- [x] **S01: TypeScript types and static data files** `risk:low` `depends:[]`
  > After this: Import shows.ts and log all 50 shows with correct types — no compile errors

- [x] **S02: yearToPixel density algorithm** `risk:high` `depends:[S01]`
  > After this: Vitest suite passes: yearToPixel(793, zones) returns correct pixel for Vikings start, pixelToYear inverts it, BC dates work

- [x] **S03: Year display formatting and filter utilities** `risk:low` `depends:[S01]`
  > After this: yearToDisplay(-73, 'fr') returns '73 av. J.-C.', yearToDisplay(-73, 'en') returns '73 BC'

## Boundary Map

Not provided.
