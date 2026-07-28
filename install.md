# Local setup

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Unit test coverage report |
| `npx playwright install --with-deps chromium` | Install Playwright browser (first time only) |
| `npx playwright test` | E2E tests (starts dev server automatically) |

## E2E tests

Playwright starts the dev server automatically via `webServer` config. If port 3000 is already occupied it will reuse the running server.

```bash
npx playwright install --with-deps chromium   # one-time
npx playwright test                            # run all e2e
npx playwright test e2e/timeline-s02.spec.ts  # single spec
```

Reports land in `playwright-report/` on failure.
