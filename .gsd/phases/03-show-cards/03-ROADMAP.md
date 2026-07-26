# M003: Show Cards

**Vision:** Render show cards on the timeline at their yearToPixel position, with narrative span bars, swim-lane layout to avoid collisions, star-node glow effects, and constellation lines between related shows.

## Success Criteria

- Each show card positioned at yearToPixel(narrativeYearStart)
- Narrative span bars stretch from yearStart to yearEnd for multi-decade shows
- Swim-lane layout prevents card overlap (6 or fewer shows per zone)
- Stacking fallback activates for zones with 7+ shows
- Star-node glow effect per era color from V5 design
- Constellation lines connect shows sharing tags within the same era
- Show card displays poster placeholder, title, narrative dates, platform badge

## Slices

- [ ] **S01: ShowCard component with star-node glow and positioning** `[sketch]` `risk:medium` `depends:[]`
  > After this: Show cards appear at correct yearToPixel positions with era-colored star glow, poster placeholder, title, and dates

- [ ] **S02: Swim-lane layout engine** `[sketch]` `risk:high` `depends:[S01]`
  > After this: Cards in dense eras arrange in swim lanes without overlap. Sparse eras center cards.

- [ ] **S03: Narrative span bars and constellation lines** `[sketch]` `risk:medium` `depends:[S01]`
  > After this: Vikings shows a span bar from 793 to 1002. Lines connect tag-related shows. Hover highlights connections.

## Boundary Map

Not provided.
