# M007: Bilingual Routing and i18n

**Vision:** Wire up next-intl for full FR/EN bilingual support — locale-segmented routes, translation files, root redirect with no-JS fallback, and all user-facing strings externalized to message files.

## Success Criteria

- All routes under /fr/ and /en/ with correct translations
- Root / redirects to /fr/ or /en/ based on navigator.language
- meta http-equiv refresh fallback for no-JS on root page
- All UI strings (nav, filters, tooltips, detail panel) externalized to messages/fr.json and messages/en.json
- Locale switch in nav bar toggles between FR and EN preserving current URL state
- Show data bilingual: titles, historical context, event names in both languages

## Slices

- [ ] **S01: next-intl routing and message files** `[sketch]` `risk:medium` `depends:[]`
  > After this: /fr/ shows French UI, /en/ shows English UI. Root / redirects based on browser language.

- [ ] **S02: Externalize all hardcoded strings** `[sketch]` `risk:low` `depends:[S01]`
  > After this: Switch locale — all UI labels, tooltips, filter names, era descriptions update to match language

## Boundary Map

Not provided.
