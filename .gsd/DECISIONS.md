# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? | Made By |
|---|------|-------|----------|--------|-----------|------------|---------|
| D001 | Planning S02 (yearToPixel density algorithm) — M001 | architecture | Where does data/density.ts (precomputed zones) get built, and when in the roadmap? | S02 implements only the pure lib functions (lib/constants.ts, lib/density.ts, lib/yearToPixel.ts, lib/pixelToYear.ts) parameterized by an explicit totalWidth argument. data/density.ts (a precomputed export, per ARCHITECTURE.md's directory sketch) is deferred to whichever later UI slice first needs a concrete totalWidth. | totalWidth is a layout/viewport concern that no slice has established yet (no Timeline component exists). Precomputing zones against a guessed width now would bake in a number no consumer confirmed; buildDensityZones already takes totalWidth as a parameter per ARCHITECTURE.md's signature, so deferring the precomputed export costs nothing and avoids inventing UI-layer values inside a pure-algorithm slice. | true | agent |
| D002 | Planning S02 (yearToPixel density algorithm) — M001 | architecture | Which Show field feeds density placement (show count per era) in buildDensityZones? | Use Show.narrativeYearStart (the year the show's story is set in) to bucket a show into an era, not broadcastYearStart (the year it aired). | The timeline visualizes historical narrative time, not broadcast history; ARCHITECTURE.md's own S02 demo example (yearToPixel(793, zones) for "Vikings start") uses 793, which is Vikings' narrativeYearStart (793-865), not its broadcastYearStart (2013-2020). | true | agent |
