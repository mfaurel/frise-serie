# M004: Historical Events and Flashbacks

**Vision:** Add historical event markers on the timeline axis (Fall of Rome, French Revolution, etc.) and flashback badges on shows that span multiple eras, creating contextual anchors that connect fiction to real history.

## Success Criteria

- Historical event markers appear at correct yearToPixel positions on the axis layer
- Event tooltips show name and year in current locale
- Flashback badges on shows link to secondary time positions
- Events use distinct visual style (pin/diamond) vs show cards (star nodes)
- Events integrate with the parallax axis layer (0.6x speed)

## Slices

- [ ] **S01: Historical event markers on axis layer** `[sketch]` `risk:low` `depends:[]`
  > After this: Event pins appear on the axis at correct positions. Hover shows tooltip with event name and year in FR/EN.

- [ ] **S02: Flashback badges and secondary positions** `[sketch]` `risk:medium` `depends:[S01]`
  > After this: A show with flashbacks displays a badge linking to the flashback era. Clicking scrolls to that position.

## Boundary Map

Not provided.
