# GSD context snapshot (2026-07-26T20:22:15.764Z)

## Active context
Active: M001 / S02 / T02 - Implement lib/yearToPixel.ts and lib/pixelToYear.ts

## Top project memories
- [MEM004] (architecture) Where does data/density.ts (precomputed zones) get built, and when in the roadmap? Chose: S02 implements only the pure lib functions (lib/constants.ts, lib/density.ts, lib/yearToPixel.ts, lib/pixelToYear.ts) parameterized by an explicit totalWidth argument. data/density.ts (a precomputed …. Rationale: totalWidth is a layout/viewport concern that no slice has established yet (no Timeline component exists). Precomputing zones against a guessed width now would bake in a number no consumer confirmed; ….
- [MEM005] (architecture) Which Show field feeds density placement (show count per era) in buildDensityZones? Chose: Use Show.narrativeYearStart (the year the show's story is set in) to bucket a show into an era, not broadcastYearStart (the year it aired).. Rationale: The timeline visualizes historical narrative time, not broadcast history; ARCHITECTURE.md's own S02 demo example (yearToPixel(793, zones) for "Vikings start") uses 793, which is Vikings' narrativeYea….
- [MEM001] (convention) For data-only slices in frise-serie, tests read the real static data files directly rather than mocking — the static data IS the real surface being tested. Negative-path assertions reuse the same validator logic against both contrived bad inputs and the full real dataset.
- [MEM002] (architecture) DensityZone type was placed in types/index.ts during S01 (types/data slice) rather than deferred to S02 (yearToPixel algorithm slice), since ARCHITECTURE.md defines it as a type sketch consumed by the density engine — avoids a redundant type-definition task in S02.
- [MEM003] (gotcha) The 9 eras in data/eras.ts are required to be contiguous (sorted eras' yearStart must equal the previous era's yearEnd) even though this isn't an explicit written requirement — it's implied by ARCHITECTURE.md's continuous-timeline model 
…[truncated]
