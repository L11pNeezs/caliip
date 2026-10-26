# Caliip

A Bun workspaces monorepo for a local-first calorie-tracking PWA.

## Requirements

- [Bun](https://bun.sh) 1.3 or later.

Run this command to install bun:

### macOS & Linux

```sh
curl -fsSL https://bun.sh/install | bash
```

### macOS & Linux

```sh
powershell -c "irm bun.sh/install.ps1|iex"
```

## Setup and development

Run these commands from the repository root:

```sh
bun install
bun run dev
```

This starts both applications:

- Web: <http://127.0.0.1:5173>
- API health check: <http://127.0.0.1:3000/api/health>

The welcome page checks the backend using native Fetch through Vite's `/api`
proxy. It displays `API: available` when both servers are running. Both servers
reload on changes. Press Ctrl+C to stop them.

To run them in separate terminals:

```sh
bun run dev:api
```

```sh
bun run dev:web
```

No API keys or environment file are required. For overrides, copy `.env.example`
to `.env` in the root and adjust `API_HOST` / `API_PORT`. Restart both servers
after changing environment variables. The backend and Vite proxy read this file.
The root `.env` is ignored by Git; OpenAI and USDA keys are reserved for future
backend use and must never use a `VITE_` prefix.

## Checks and production build

```sh
bun run check  # Type-check frontend, Vite configuration, and backend
bun run test   # Run Vitest once
bun run build  # Type-check and build the frontend, manifest, and service worker
```

```sh
bun run --filter @caliip/web preview  # Preview the web build on port 4173
bun run --filter @caliip/api start   # Start the backend without watch mode
```

The `/api` proxy is configured for the development server. For a deployed build,
route `/api/*` to the Bun backend and serve other routes with an `index.html`
fallback for Vue Router. Vite preview is for checking built assets, not a full
deployment with an API proxy. The service worker is generated for production
builds; development does not register one. Only application assets are precached;
external requests and `/api` responses are not cached.

## Structure

```text
apps/
  web/
    src/
      components/          Reusable Vuetify UI
      views/               Home, meal list, meal details, and entry forms
      composables/         Shared reactive Vue logic
      router/              Vue Router with browser history
      db/                  Dexie schema and meal/food persistence operations
      types/               Meal and FoodEntry interfaces
      services/
        api.ts             Native Fetch API health check
        ai/                Reserved for future backend calls
        nutrition/         Reserved for future backend calls
  api/
    src/index.ts           Bun HTTP server; GET /api/health only
docs/
  architecture.md          Responsibilities, structure, and planned data flows
  data-schema.md           Planned Meal and FoodEntry model
  dexie-schema.md          Documented Dexie reference implementation
  planning.md              Initial development plan
  report.md                Initial project report outline
  decisions/               Technology rationale and decision records
```

The frontend uses Vue 3, TypeScript, Vite, Vuetify 3, Vue Router, Dexie,
date-fns, vite-plugin-pwa, and Vitest. State uses Vue composables and HTTP uses
native Fetch.

## Scope and project documentation

Project documentation is available under [`docs/`](docs/architecture.md):

- [Architecture](docs/architecture.md): responsibilities and planned data flows.
- [Technology decisions](docs/decisions/README.md): stack choices and reasoning.
  - [001: Database](docs/decisions/001-database.md)
  - [002: AI and nutrition providers](docs/decisions/002-ai-provider.md)
  - [003: PWA](docs/decisions/003-pwa.md)
- [Data schema](docs/data-schema.md) and [Dexie reference](docs/dexie-schema.md).
- [Development plan](docs/planning.md): initial outline for subsequent stages.
- [Project report](docs/report.md): scaffold summary and an outline to expand.
- [Test reference](docs/testing.md): test scenarios, run commands, troubleshooting, and a template for future suites.

The original source documents remain preserved in the project root:
`architecture`, `data schema`, `dexie.js implementation of data schema`,
`decisions`, and `requirements`.

### CAL-3: Manual food entry

1. From Home, choose **Create meal**, enter a name and date, and save.
2. The meal detail screen shows the saved meal and its food entries.
3. Choose **Add food** and enter a name, positive quantity in grams, and
   calories/protein/carbohydrates/fat per 100 g. Zero nutrition values are valid;
   blank, negative, or non-finite values are not.
4. Saving returns to the meal and updates its calculated nutritional totals.
5. Choose **Remove** beside an entry to delete it. Removing the final food keeps
   the empty meal, which can receive new entries later.
6. Use **View meals** on Home to reopen meals, newest meal dates first.

Meals and food entries persist in this browser's `CaliipDB`: `meals` is indexed
by `++id, date` and `foodEntries` by `++id, mealId`. Dates use local `YYYY-MM-DD`
values. Totals are calculated, not stored. Manual tracking works with just the
frontend running; the backend health status does not block it. Clearing browser
site data removes the local history, and different origins have separate data.

The original root `requirements` describes the earlier scaffold milestone.
CAL-3 adds meal creation/listing and food addition/removal. Editing, meal deletion,
calendar overviews, micronutrients, AI, and USDA integration remain future work.

The route flow is `/` → `/meals` → `/meals/:mealId`, with `/meals/new` for meal
creation and `/meals/:mealId/foods/new` for food entry. Invalid or missing meals
show an error and do not allow food insertion.

`bun run test` includes fake-indexeddb coverage for generated keys, persistence
after reopening, date ordering, validation, meal relationships, and deletion.

The backend will eventually proxy `POST /api/analyze-meal` and
`GET /api/foods/search`, protecting API keys without persisting meal history.
Those endpoints currently return 404.

Commit `bun.lock` when connecting this project to GitHub for reproducible installs.
