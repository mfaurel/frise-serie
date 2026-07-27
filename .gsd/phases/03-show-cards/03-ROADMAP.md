# M003: Show Cards

**Vision:** Render show cards on the timeline at their yearToPixel position, with narrative span bars, swim-lane layout to avoid collisions, star-node glow effects, and constellation lines between related shows.

## Slices

- [ ] **S01: ShowCard component with star-node glow and positioning** `[sketch]` `risk:medium` `depends:[]`
  > After this: Show cards appear at correct yearToPixel positions with era-colored star glow, poster placeholder, title, and dates

- [ ] **S02: Swim-lane layout engine** `[sketch]` `risk:high` `depends:[S01]`
  > After this: Cards in dense eras arrange in swim lanes without overlap. Sparse eras center cards.

- [ ] **S03: Narrative span bars and constellation lines** `[sketch]` `risk:medium` `depends:[S01]`
  > After this: Vikings shows a span bar from 793 to 1002. Lines connect tag-related shows. Hover highlights connections.

## Boundary Map

Not provided.
