# Architecture

Caliip is a local-first calorie-tracking PWA. Vue handles the application and
IndexedDB holds meal history. The Bun backend will only protect API keys,
validate requests, and proxy OpenAI and USDA requests; it will not store meals.

This document adapts the original root `architecture` and `decisions` documents.

## Project structure

```text
caliip/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/          Reusable Vuetify components
│   │   │   ├── views/               Routed screens
│   │   │   ├── db/                  Dexie setup and persistence operations
│   │   │   ├── services/
│   │   │   │   ├── api.ts           Native Fetch health check
│   │   │   │   ├── ai/              Future calls to the Bun API
│   │   │   │   └── nutrition/       Future calls to the Bun API
│   │   │   ├── composables/         Shared reactive Vue logic
│   │   │   ├── types/               Meal and FoodEntry interfaces
│   │   │   └── router/              Vue Router
│   │   └── package.json
│   └── api/
│       ├── src/index.ts             Minimal Bun HTTP server
│       └── package.json
├── docs/
│   ├── report.md
│   ├── planning.md
│   ├── architecture.md
│   ├── data-schema.md
│   ├── dexie-schema.md
│   └── decisions/
│       ├── README.md
│       ├── 001-database.md
│       ├── 002-ai-provider.md
│       └── 003-pwa.md
├── README.md
└── package.json                     Bun workspaces
```

CAL-3 includes HomeView, NewMealView, MealListView, MealView, and AddFoodEntryView.
Home links to creation and the saved-meals list. Selecting or creating a meal
opens its detail screen, where foods can be added or removed. A successful food
save returns to meal details. Local persistence does not depend on the backend.

Daily, weekly, monthly, and settings views and external integrations are future
work. The original architecture's `openai.ts` module will be added when that
integration is implemented.

## Responsibilities

| Frontend | Backend |
| --- | --- |
| Vuetify UI and Vue Router navigation | Keep external API keys server-side |
| Shared state through Vue composables | Validate external requests and uploads |
| Local meal creation/listing and food addition/removal | Apply reasonable request limits |
| Calculated meal calories and macronutrients | Proxy future OpenAI and USDA requests |
| Future daily, weekly, and monthly overviews | Return results without storing meal history |

Use native Fetch for HTTP requests on both sides. During development, Vite
proxies `/api` to the Bun server. Deployment must route `/api/*` to Bun and
provide an `index.html` fallback for browser-history navigation.

## Planned data flows

Manual nutritional entry and meal totals are implemented. USDA lookup, AI
analysis, and calendar overviews below remain planned.

### Manual food entry

1. Create a meal.
2. Search USDA through the backend or enter nutritional values manually.
3. Select the quantity in grams.
4. Calculate calories from the food entries.
5. Save the meal and food entries to IndexedDB.

### AI photo analysis

1. Select or capture a photo using an HTML file input.
2. Send the photo to `POST /api/analyze-meal` on the Bun API.
3. The backend calls OpenAI for food identification and estimated quantities.
4. Look up nutritional values through `GET /api/foods/search` and USDA.
5. Let the user review and correct the estimates.
6. Save the confirmed entries to IndexedDB.

### Daily, weekly, and monthly views

1. Query IndexedDB through Dexie.
2. Calculate totals in TypeScript, using date-fns for calendar navigation.
3. Display numerical calorie and macronutrient totals with Vuetify.

Saved meals should remain viewable offline once these features exist. External
API calls require a connection.

## Related documentation

- [Data schema](data-schema.md)
- [Dexie reference implementation](dexie-schema.md)
- [Technology decisions](decisions/README.md)
- [Development plan](planning.md)
