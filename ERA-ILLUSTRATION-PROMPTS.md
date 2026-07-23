# Era Background Illustration Prompts

AI image generation prompts for each era's parallax background layer.
**Not used in MVP** (MVP uses CSS gradients only). Generate these when ready to add visual depth.

**Target format:** 3840×1080px (ultra-wide, seamless horizontal tile), PNG or WebP.
**Style direction:** Muted, atmospheric, low-contrast so text and cards remain readable as foreground. Think museum wall texture, not illustration focal point. No faces, no specific characters — abstract/environmental only.

---

## Antiquité (Antiquity) · -3000 → 476

**Prompt:**
> Ancient Mediterranean landscape, faded fresco texture on crumbling plaster wall. Columns and temple silhouettes in warm terracotta and burnt sienna tones. Distant pyramids and aqueducts dissolving into haze. Papyrus and sandstone textures. Atmospheric perspective, muted palette, no people. Ultra-wide panoramic format, seamless horizontal tile. Museum exhibition backdrop style, low contrast, aged patina.

**Color anchors:** `#1a0a00`, `#2d1810`, `#4a2a1a`, `#8b6914`

---

## Moyen Âge (Middle Ages) · 476 → 1453

**Prompt:**
> Medieval atmospheric landscape, stone castle walls fading into fog. Gothic cathedral silhouettes, iron and steel blue tones. Illuminated manuscript gold leaf accents scattered subtly. Bare winter forests, torch-lit stone corridors. Chainmail and heraldic textures as abstract patterns. Cold iron palette with deep indigo shadows. Ultra-wide panoramic, seamless tile, museum backdrop, muted and atmospheric.

**Color anchors:** `#0a0f1a`, `#1a2040`, `#2a1a30`, `#4a3a50`

---

## Renaissance · 1453 → 1600

**Prompt:**
> Italian Renaissance architectural perspective, Florentine palazzo arches receding into golden light. Marble floors and coffered ceilings. Warm amber and gold tones, oil painting craquelure texture. Distant Tuscan hills through arched windows. Da Vinci-style sfumato atmosphere. Rich but muted gold and sepia palette. Ultra-wide panoramic format, seamless horizontal tile, exhibition wall backdrop.

**Color anchors:** `#1a1000`, `#3d2b00`, `#5c4a1a`, `#8b7530`

---

## Époque Moderne (Early Modern / Baroque) · 1600 → 1789

**Prompt:**
> Baroque palace interior dissolving into abstract forms. Versailles-inspired gilded mirrors and chandeliers as ghostly silhouettes. Deep teal and purple velvet textures. Candlelight glow creating pools of warm amber in dark spaces. Ship masts and compass roses as subtle watermarks. Rembrandt-style chiaroscuro lighting. Ultra-wide panoramic, seamless tile, atmospheric museum backdrop.

**Color anchors:** `#0a1a1a`, `#1a3030`, `#2a1a3a`, `#3a2a4a`

---

## Révolutions (Age of Revolutions) · 1789 → 1848

**Prompt:**
> Revolutionary-era atmospheric scene: smoke-filled streets, barricade silhouettes, tricolor flag fragments as abstract shapes. Red and dark crimson dominate, with ashen gray smoke. Cobblestone textures, cannon wheel fragments, torch flames. Delacroix painting style but desaturated and abstracted. Engraving crosshatch texture overlaid. Ultra-wide panoramic, seamless tile, low contrast museum backdrop.

**Color anchors:** `#1a0a0a`, `#3a1010`, `#4a1a1a`, `#5a2020`

---

## XIXe siècle (19th Century / Industrial Age) · 1848 → 1914

**Prompt:**
> Industrial revolution cityscape, factory chimneys and iron bridges dissolving into coal smoke. Steel blue and graphite palette. Steam locomotive silhouettes, gas lamp glow, Victorian brick textures. Telegraph wires crossing the sky like musical staff lines. Engraved illustration style, cross-hatching texture. Fog and soot atmosphere. Ultra-wide panoramic format, seamless horizontal tile, muted museum exhibition backdrop.

**Color anchors:** `#0f0f1a`, `#1a1a2a`, `#2a2530`, `#3a3540`

---

## Guerres mondiales (World Wars) · 1914 → 1945

**Prompt:**
> Wartime atmospheric landscape: trenches and barbed wire fading into no-man's-land fog. Charcoal and ash palette with muted blood-red accents. Searchlight beams cutting through smoke. Silhouettes of ruins, rubble, distant fires on the horizon. Grainy photographic texture, war correspondent dispatch style. Somber, heavy, oppressive atmosphere. Ultra-wide panoramic, seamless tile, memorial wall backdrop.

**Color anchors:** `#0a0a0a`, `#1a1a1a`, `#2a2020`, `#3a2a2a`

---

## Guerre froide (Cold War) · 1945 → 1991

**Prompt:**
> Cold War noir atmosphere: concrete brutalist architecture, Berlin Wall fragments, surveillance camera silhouettes. Cold blue-gray palette with occasional neon sign glow (amber, cyan). Film noir shadows, venetian blind light patterns. Spy thriller aesthetics: dead drops, codex pages, radio static texture. Rain-slicked streets reflecting distant city lights. Ultra-wide panoramic format, seamless horizontal tile, intelligence dossier backdrop style.

**Color anchors:** `#0a0a1a`, `#101a2a`, `#1a2a3a`, `#2a3a4a`

---

## Époque contemporaine (Contemporary) · 1991 → present

**Prompt:**
> Modern digital age abstract landscape: data streams and network topology rendered as faint constellation maps. Cool slate and teal palette. Glass skyscraper reflections, satellite dish silhouettes, fiber optic light trails. Screen glow blue tones. Circuit board patterns dissolving into urban geometry. Clean, minimal, slightly clinical. Technological sublime. Ultra-wide panoramic format, seamless horizontal tile, tech museum backdrop.

**Color anchors:** `#0a0f14`, `#141e28`, `#1e2832`, `#283842`

---

## Generation Notes

- **Negative prompt (common to all):** faces, people, characters, text, watermarks, signatures, logos, high contrast, bright colors, photorealistic, 3D render
- **Model suggestion:** Midjourney v6 or SDXL with `--ar 32:9 --style raw --s 250`
- **Post-processing:** Reduce contrast to ~60%, apply slight Gaussian blur (2px), overlay with `multiply` blend at 40% opacity on the CSS gradient to unify with the code palette
- **File naming:** `era-{id}.webp` (e.g., `era-antiquity.webp`, `era-middle-ages.webp`)
- **Integration:** Set `backgroundAssetUrl` in `data/eras.ts` once generated. BackgroundLayer renders as `background-image` layered over the CSS gradient with `opacity: 0.4`.
