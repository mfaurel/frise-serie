# M009: Data Completion and SEO

**Vision:** Expand the show dataset to 100+ series, add SEO metadata (Open Graph, structured data, sitemap), and deploy to GitHub Pages with the CI/CD pipeline.

## Success Criteria

- 100+ shows in the static dataset with balanced era coverage
- Open Graph meta tags on all pages (title, description, image)
- JSON-LD structured data for shows (schema.org/TVSeries)
- Sitemap.xml generated at build time
- GitHub Actions CI/CD pipeline deploys to GitHub Pages on push to main
- Lighthouse SEO score 90+
- All shows have bilingual historicalContext entries

## Slices

- [ ] **S01: Expand dataset to 100+ shows** `[sketch]` `risk:medium` `depends:[]`
  > After this: npm run build succeeds with 100+ shows. Timeline renders all shows without performance degradation.

- [ ] **S02: SEO metadata and structured data** `[sketch]` `risk:low` `depends:[]`
  > After this: View page source shows Open Graph tags. Google Rich Results test validates JSON-LD. Sitemap exists at /sitemap.xml.

- [ ] **S03: GitHub Actions CI and CD pipeline** `[sketch]` `risk:low` `depends:[S01,S02]`
  > After this: Push to main triggers build and deploy. Site live at username.github.io/frise-serie/.

## Boundary Map

Not provided.
