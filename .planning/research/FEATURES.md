# Feature Landscape — Historical Series Timeline

**Domain:** Interactive parallax discovery / entertainment browsing / historical education
**Researched:** 2026-05-17
**Overall confidence:** HIGH (core UX patterns) / MEDIUM (anti-features, engagement data)

---

## Table Stakes

Features users expect. Missing = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Smooth horizontal scroll | Core UX metaphor — the whole product IS the scroll | High | Must work on trackpad, mouse wheel, arrow keys, and touch swipe simultaneously |
| Visual affordance of scrollability | Users don't discover horizontal scroll without a hint; NN/G research shows this is a leading failure point | Low | Peeking right edge on load, subtle arrow indicators, or animated hint on first visit |
| Era color-coding | Users orient spatially in a 5000-year timeline; color is the anchor | Medium | Must be distinct enough for colorblind users (WCAG AA) |
| Show poster as primary visual | Streaming apps (Netflix, JustWatch) trained users to recognize shows by poster | Low | Poor poster = card feels broken; WebP via CDN is a hard requirement |
| Show card: title + narrative years visible without hover | Cards in a spatial UI must be self-describing; hover-only labels fail on touch | Low | Title and year range as always-visible text, not tooltip |
| Story year placement (not broadcast year) | This IS the unique value proposition; without it, the timeline is just a list | High | Requires careful editorial data — wrong placement destroys trust |
| Narrative span bar / indicator | Shows like Rome (52 BC – 44 BC) vs Peaky Blinders (1919–1930+) differ radically in scope; users need to see this at a glance | Medium | A horizontal bar extending from the card anchor point communicates span without labels |
| Streaming platform badge on card | Binge-watchers (P4) need "where to watch" at a glance; JustWatch proved this is table stakes | Low | Platform logo icons, not text |
| Click-through to streaming link | Direct path from discovery to watch; PRD target is 15% CTR | Low | Opens in new tab; must be correct per country eventually |
| Historical accuracy score on card | Differentiates "real history" from "fantasy with swords"; critical for teachers (P3) and history enthusiasts (P2) | Low | 1–5 stars or equivalent visual indicator; must be explained once (tooltip or legend) |
| Filter by era / period | Most common navigation intent: "show me medieval series" — users do not scroll 5000 years to find what they want | Medium | Era segments should be clickable jumps, not just a filter dropdown |
| Filter by streaming platform | "What can I watch on Netflix tonight?" is a primary use case across all personas | Low | Multi-select; show zero-result states clearly |
| Text search | Users who already know what they want (e.g., "show me Vikings") should not be forced to scroll | Medium | Title search is mandatory; historical figure search is a differentiator |
| Responsive mobile — native swipe | Over 60% of web traffic is mobile; horizontal swipe on touch is the natural gesture for timeline navigation | High | This is explicitly UX-01/UX-02 in the PRD; it is non-negotiable |
| Side panel / modal detail on card click | Cards show only enough to decide; the detail panel delivers what commits a user (synopsis, links, similar shows) | Medium | Slide-in from right; must not destroy scroll position |
| Historical context synopsis (not plot synopsis) | Unique to this product — "what was happening in 9th century England" not "what happens in episode 1" | High | Entirely editorial; this is what makes the product trustworthy to P2/P3 |
| Wikipedia link from detail panel | Users want to go deeper; Wikipedia is the universal reference | Low | External link; use `rel="noopener noreferrer"` |
| Skeleton loading < 1s | Users abandon if nothing appears in 1s; skeleton screens communicate structure before content | Medium | Timeline skeleton must show era zones and card placeholders |
| Keyboard navigation (←/→ arrows) | WCAG AA; also power users prefer keyboard; trackpad/mouse wheel must scroll the timeline | Low | Arrow keys = scroll; Enter/Space = open detail; Escape = close detail |
| Shareable era-anchored URL | US-03 explicitly: a teacher shares a link to "the timeline at the 16th century"; this requires URL state | Medium | `/en?era=renaissance` or `?year=1500`; the detail panel URL should also be shareable |
| Bilingual FR/EN | French-first audience; core requirement from day one | Medium | next-intl; locale prefix routing `/fr` `/en`; all card text, labels, synopsis, historical context |
| prefers-reduced-motion fallback | WCAG 2.1 SC 2.3.3; parallax triggers vestibular disorders; up to 35% of users over 40 may experience discomfort | Medium | When reduced-motion is active: disable parallax depth, keep content visible, fade instead of move |
| ARIA labels on interactive elements | WCAG AA; cards, filters, scroll container need proper roles and labels | Medium | Timeline scroll region needs `role="region"` + `aria-label`; cards need `role="article"` |

---

## Differentiators

Features that create competitive advantage. Not universally expected, but valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Non-linear time scale | 5000 years of history has unequal series density; compressing "sparse" eras (e.g., 2000 BC–500 BC) and expanding "rich" eras (20th century) makes the discovery surface feel full and intentional, not wasteful | High | Requires careful calibration; the scale equation is a design decision that affects everything |
| Historical event markers on timeline axis | Contextualizes shows without requiring the user to know history; seeing "Fall of Rome" next to *Rome* creates an "aha" moment that no other product delivers | Medium | Tooltip on hover/tap; event markers must not clutter the axis |
| Flashback badge and secondary placement | Shows like *The Last Kingdom* or *Outlander* have significant flashback arcs; acknowledging this is honest and sophisticated; no competitor does this | High | Bi-directional link between primary card and flashback era; visually distinct badge |
| Historical accuracy score (editorial, 1–5) | Letterboxd-style credibility signal; differentiates this product from simple "shows by setting" lists on Wikipedia | Medium | Must include a visible legend explaining the scale once; "docudrama" vs "fantasy" framing helps |
| "Similar shows in this era" recommendation | Contextual recommendations ("you're looking at Vikings — here are 3 more Norse-era series") outperform genre-based recommendations for this product's audience | Medium | Computed from era + region overlap; no ML needed in v1, just editorial curation or simple query |
| Era-jump quick navigation | A persistent top bar or mini-map showing era names (Antiquity, Middle Ages, Renaissance…) lets users teleport rather than scroll; this solves the discoverability problem of horizontal scroll | Medium | Sticky nav with era tabs; clicking scrolls the timeline to that region with a smooth animation |
| "Classroom mode" — frozen shareable link | Teachers (P3) need a URL that opens at a specific era with no UI chrome, suitable for classroom projection; US-03 explicitly calls this out | Medium | Query param `?mode=classroom&era=renaissance`; hides filter bar, shows only timeline + info panel |
| Narrative span visualization across eras | A show whose story covers 400 years (e.g., a dynasty saga) creates a visual bridge across multiple eras; this is unique to a timeline format | High | Cards with wide spans need visual treatment that doesn't obscure other cards in overlapping years |
| Dark / light mode toggle | Parallax backgrounds (parchment, stone, earth tones) look dramatically better on dark backgrounds; dark mode is expected by modern users | Low | CSS variables + Tailwind dark: utilities; persist preference in localStorage |
| Trailer link on detail panel | Optional but high-value for the binge-watcher (P4) who needs to "feel" a show before committing | Low | Embed YouTube trailer in modal; YouTube thumbnail as preview |
| Geolocation-aware streaming availability | "Available in my country" filter (F-22) is a v2/stretch feature but unlocks significant practical value | High | Requires either a streaming availability API (Reelgood, JustWatch API) or manual per-country data; skip v1 |
| Watchlist with Watched / Watching / To Watch | Engagement anchor; gives users a reason to return; Letterboxd proved this is the highest-retention feature in discovery apps | High | Requires auth; defer to post-launch per PROJECT.md |
| Historical figure search | Searching "Napoleon" and finding all series featuring him is unique to this product; no streaming app does this | Medium | Requires `historicalFigures` field populated in data; Algolia or full-text search over that field |

---

## Anti-Features

Features to deliberately NOT build in v1. Building them wastes time and often hurts UX.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User ratings / star scores | Crowdsourced ratings create credibility theatre; a half-empty catalog with 2 ratings per show feels worse than no ratings; Letterboxd took years to accumulate meaningful ratings density | Use editorial accuracy score (1–5) which is under your control and always complete |
| Comments / community forum on show cards | Research shows the vast majority of discovery app users never write reviews or comments; the feature creates empty-state ugliness and moderation burden | Build "suggest a show" contribution form (F-27) in v2 when you have a user base to moderate |
| Social follow / activity feed | Building a social graph requires a critical mass of users to feel alive; an empty feed is worse than no feed | Focus on shareable links (classroom mode, era-anchored URLs) as the social primitive in v1 |
| Onboarding tutorial / walkthrough | NN/G research: "show, don't tell" works when affordances are good; a tutorial signals your UX failed; PRD UX-01 explicitly says no tutorial | Fix the affordances instead: peeking cards, animated first-scroll hint, visible era labels |
| Infinite scroll / pagination on a timeline | A timeline is spatially continuous; pagination breaks the spatial metaphor; lazy loading must be transparent to the user | Use progressive / intersection-observer loading that fetches next segments as user approaches them |
| List view / grid view toggle | The timeline IS the product; offering a list view undermines the value proposition and duplicates effort | The detail panel and search results can be list-like when needed without a full alternative view |
| Real-time streaming availability API | Costs money, adds latency, creates dependency on external API reliability; data staleness is acceptable for a discovery tool | Manual or weekly-updated platform data per PRD; flag data vintage ("Updated monthly") |
| Algorithmic recommendation feed (home page) | An ML-driven "For You" feed requires substantial user behavior data to be useful; cold start problem makes it feel broken for new users | Curated "staff picks" or "featured shows" editorial content in v1; watchlist-based recs in v2 |
| Native mobile app (iOS/Android) | PWA with proper manifest, service worker, and touch gestures covers 95% of the mobile use case without the App Store overhead | Invest the saved time in making the PWA experience excellent (touch, performance, offline) |
| User-editable narrative dates (wiki-style) | Community date correction (F-28) requires moderation infrastructure, dispute resolution, and a trust model; ships a can of worms | Accept community suggestions via a form (F-27) reviewed by the editorial team; no direct editing |
| Films / movies | Scope creep; series have ongoing narrative arcs that map naturally to timeline spans; films are point events that add data complexity | Explicitly out of scope v1 per PRD; revisit only after 150+ shows are indexed |
| Audio / ambient background music per era | Sounds compelling in theory; in practice it is deeply annoying after 10 seconds and creates significant accessibility issues | Era-appropriate color palettes and textures deliver the mood without the UX liability |
| Hover-only information on cards | Touch users never get hover states; any information that only appears on hover is invisible to ~50% of users | All essential information (title, years) visible by default; secondary info in detail panel |
| Full-page parallax on mobile | Performance is poor, gesture conflicts are severe (vertical page scroll vs horizontal timeline scroll vs parallax layers), and the W3C warns of vestibular impact | On mobile, simplify to 2 layers max (background + cards) or flat design with subtle CSS transitions |

---

## Mobile-Specific Requirements

These requirements are unique to the mobile (touch) context and differ from desktop patterns.

| Requirement | Rationale | Implementation Notes |
|-------------|-----------|---------------------|
| Touch target minimum 44x44px | WCAG AA; Apple HIG; Google Material — all specify 44–48px minimum; show cards and filter chips must meet this | Cards in mobile viewport should be at least 44px tall with generous padding |
| Horizontal swipe must not conflict with vertical page scroll | The single biggest technical risk on mobile; the browser's default scroll direction disambiguation must be overridden carefully | Use `touch-action: pan-x` on the timeline container to lock to horizontal; test on both iOS Safari and Android Chrome |
| Clear swipe affordance (peeking next content) | Research from NN/G and Suleiman Shakir (UX Collective): the rightmost card must visually bleed off the edge to signal "more exists" | Ensure the timeline never shows a flush right edge; always have 30–50% of the next card visible |
| Era jump nav accessible via thumb | On mobile, the bottom third of screen is the "thumb zone"; era navigation that sits at the top becomes unreachable one-handed | Consider a bottom sheet or bottom-pinned era navigation strip on mobile |
| Reduced parallax layers | Parallax on mobile causes: (1) performance jank on mid-range devices, (2) vestibular issues, (3) gesture conflicts | Mobile: background layer at 0.3x scroll speed max, or use CSS `background-attachment: fixed` as a simpler alternative |
| Tap vs scroll disambiguation | A tap on a card to open detail must not be confused with the start of a swipe; the OS default debounce (300ms) creates latency | Use `pointer-events` and touch gesture thresholds (move > 10px = scroll, not tap); consider Pointer Events API over Touch Events |
| Filter panel as bottom sheet | Mobile filter drawers that slide in from the right use precious horizontal space; bottom sheet is the standard mobile pattern (iOS native, Google Maps, etc.) | Filter panel: full-screen bottom sheet on mobile, side panel on desktop |
| No hover states as primary information | All essential card information must be tappable, not hover-dependent | Ensure the detail panel opens on tap, not on hover |
| Viewport-aware card sizing | Cards designed for desktop (200px wide) become unreadably small on a 375px screen; responsive sizing is required | Cards: `clamp(120px, 30vw, 200px)` width on mobile; poster should remain legible |
| Share via native share API | Mobile users expect the OS share sheet (Web Share API), not copy-link | Implement `navigator.share()` with fallback to copy-to-clipboard for era URL sharing |

---

## Feature Complexity Reference

Ordered by implementation complexity for roadmap planning.

### Low Complexity (1–3 days each)
- Platform badges on cards
- Click-through streaming links
- Dark/light mode toggle (CSS variables)
- Wikipedia external link
- Historical accuracy star display
- Trailer link embed in detail panel
- ARIA labels on existing components

### Medium Complexity (3–10 days each)
- Era color-coding and background textures
- Narrative span bar visualization
- Historical event markers with tooltips
- Era-jump quick navigation (persistent sticky nav)
- Side panel with slide-in animation
- Filter system (era, platform, region, genre)
- Text search (title + historical figure)
- Shareable era-anchored URLs
- Skeleton loading system
- prefers-reduced-motion fallback
- Bilingual FR/EN (next-intl routing)
- Mobile bottom-sheet filter panel
- Horizontal scroll with touch disambiguation

### High Complexity (2–4 weeks each)
- Non-linear time scale (the math and visual design of compressed/expanded eras)
- Multi-layer parallax with smooth cross-device performance
- Flashback badge system with bi-directional timeline links
- Narrative span rendering for shows covering 100+ year arcs (card overlap/stacking logic)
- User accounts + watchlist (auth, DB, UI states)
- Geolocation-aware streaming data
- Community suggestion + moderation workflow
- Personalized recommendations

---

## Dependency Map

```
Era color-coding
  → Historical event markers (needs era boundaries defined first)
  → Era-jump navigation (needs era names/dates)
  → Non-linear time scale (era boundaries drive compression points)

Show card (basic)
  → Narrative span bar (needs narrativeYearStart + narrativeYearEnd)
  → Flashback badge (needs flashbacks[] in data model)
  → Detail panel (card click target)

Detail panel
  → Similar shows (needs era + region query)
  → Watchlist button (needs auth — defer to v2)
  → Streaming links (needs platforms[] with URLs)

Text search
  → Historical figure search (needs historicalFigures[] populated in data)

Shareable URL
  → Classroom mode (extends shareable URL with UI chrome suppression)
```

---

## MVP Recommendation

**Phase 1 must include (without these, the product has no identity):**
1. Horizontal parallax timeline with 2–3 layers, smooth scroll, era color-coding
2. Show cards at story-start year with title, years, poster, platform badge, accuracy score
3. Narrative span bar
4. Era-jump navigation (sticky top nav with era names)
5. Side panel with historical context synopsis, Wikipedia link, streaming links
6. Filter: era/platform (minimum viable); region/genre as stretch
7. Skeleton loading + prefers-reduced-motion fallback
8. Shareable era-anchored URL (teachers need this from day one)
9. Mobile: touch-native swipe, peeking affordance, bottom-sheet filters
10. Bilingual FR/EN

**Defer to Phase 2 (add engagement layer):**
- Text search with historical figures
- User accounts + watchlist
- Historical event markers (nice to have, not core)
- Trailer links
- Dark/light mode toggle

**Defer to Phase 3 (community + personalization):**
- Classroom mode URL
- Community show suggestions
- Geolocation streaming availability
- Recommendations

---

## Sources

- Nielsen Norman Group — Horizontal Scrolling: https://www.nngroup.com/articles/horizontal-scrolling/
- UX Collective — Horizontal Scrolling Lists in Mobile Best Practices: https://uxdesign.cc/best-practices-for-horizontal-lists-in-mobile-21480b9b73e5
- W3C WCAG 2.1 SC 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
- NN/G — What Parallax Lacks: https://www.nngroup.com/articles/parallax-usability/
- NN/G — Cards UI Component Definition: https://www.nngroup.com/articles/cards-component/
- NN/G — Filter Categories and Values: https://www.nngroup.com/articles/filter-categories-values/
- Innerview — Parallax in UX Design Best Practices: https://innerview.co/blog/parallax-in-ux-design-enhancing-user-experience-with-dynamic-scrolling
- LogRocket — Creative Scrolling Patterns UX: https://blog.logrocket.com/ux-design/creative-scrolling-patterns-ux/
- UXmatters — Faceted Search Best Practices: https://www.uxmatters.com/mt/archives/2009/09/best-practices-for-designing-faceted-search-filters.php
- Letterboxd UX case studies (Medium): https://medium.com/@khushi.pro/letterboxd-redesign-improving-the-user-experience-of-a-social-film-discovery-platform-1b94a404ae09
- History Associates — Multidimensional Timelines: https://www.historyassociates.com/multidimensional-timelines/
- Shorthand — Best Visual Timeline Examples: https://shorthand.com/the-craft/best-visual-timeline-examples-on-the-web/index.html
- PRD — frise-serie/PRD.md (internal)
- PROJECT.md — frise-serie/.planning/PROJECT.md (internal)
