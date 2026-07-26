# M008: Mobile Polish and WCAG AA

**Vision:** Adapt the desktop-first timeline for mobile (touch swipe, responsive layout, bottom sheet sizing) and verify WCAG AA compliance across all interactive elements.

## Success Criteria

- Touch horizontal swipe works on mobile for timeline navigation
- Responsive layout: sidebar collapses on mobile, cards resize
- Bottom sheet detail panel is full-width on mobile
- All interactive elements meet WCAG AA contrast (4.5:1 for text)
- Keyboard navigation works end-to-end (arrow keys, tab, enter, escape)
- Screen reader announces era transitions, show cards, and detail panel content
- Focus visible indicators on all focusable elements

## Slices

- [ ] **S01: Responsive layout and touch navigation** `[sketch]` `risk:high` `depends:[]`
  > After this: On a mobile viewport: sidebar hidden, cards stack vertically or scroll horizontally, touch swipe navigates timeline

- [ ] **S02: WCAG AA accessibility audit and fixes** `[sketch]` `risk:medium` `depends:[S01]`
  > After this: Navigate entire app with keyboard only. Screen reader announces all content. Contrast checker passes on all text.

## Boundary Map

Not provided.
