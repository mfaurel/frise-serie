# M007: Bilingual Routing and i18n

**Vision:** Wire up next-intl for full FR/EN bilingual support — locale-segmented routes, translation files, root redirect with no-JS fallback, and all user-facing strings externalized to message files.

## Slices

- [ ] **S01: next-intl routing and message files** `[sketch]` `risk:medium` `depends:[]`
  > After this: /fr/ shows French UI, /en/ shows English UI. Root / redirects based on browser language.

- [ ] **S02: Externalize all hardcoded strings** `[sketch]` `risk:low` `depends:[S01]`
  > After this: Switch locale — all UI labels, tooltips, filter names, era descriptions update to match language

## Boundary Map

Not provided.
