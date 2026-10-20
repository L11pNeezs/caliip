# Technology decisions

These decisions summarize the original root `decisions` document. Caliip must
remain achievable within an 80-hour project, using simple browser and framework
capabilities before adding abstractions.

## Decision records

- [001: IndexedDB with Dexie](001-database.md)
- [002: OpenAI and USDA through the Bun backend](002-ai-provider.md)
- [003: PWA with vite-plugin-pwa](003-pwa.md)

## Stack and rationale

| Area | Decision | Reason |
| --- | --- | --- |
| Frontend | Vue 3 + TypeScript | Required technologies; reactive components and type safety |
| Styling | Vuetify 3 components and utilities | Required UI framework; minimize custom CSS and avoid Tailwind |
| Navigation | Vue Router with browser history | Meaningful URLs for future daily, weekly, monthly, and settings views |
| State | Vue refs, computed values, and composables | Straightforward shared logic; no current need for Pinia |
| Storage | IndexedDB + Dexie | Local source of truth, simplified queries, migrations, and transactions |
| Dates | date-fns | Calendar navigation and aggregation using local `YYYY-MM-DD` dates |
| HTTP | Native Fetch | Available in browsers and Bun without Axios |
| Backend | Bun's built-in HTTP server | Native TypeScript support with no backend framework |
| Monorepo | Bun workspaces | Simple Git monorepo without Nx or Turborepo |
| PWA | vite-plugin-pwa | Manifest and service worker integrated with Vite |
| Testing | Vitest | Fits Vite; focus future tests on calculations, aggregation, and database CRUD |
| Validation | Vuetify rules and TypeScript, plus server-side request validation | Keep validation simple; no current need for Zod |
| Statistics | Numerical calorie and macronutrient totals | Avoid an unnecessary charting dependency |

Dexie and date-fns are installed but not yet used for domain features. Future
database tests may use fake-indexeddb when needed.

## Future input and integration choices

- **AI:** OpenAI for image-based food names and estimated quantities. Users must
  review estimates before saving. See [decision 002](002-ai-provider.md).
- **Nutrition:** USDA FoodData Central, accessed through Bun. Store selected
  nutritional values on food entries for offline access.
- **Voice:** Prefer the Web Speech API over paid transcription services to keep
  complexity low. Browser support varies, so retain manual entry as a fallback.
- **Camera:** Use `<input type="file" accept="image/*" capture="environment">`
  for compatible camera capture and file selection, rather than a custom live
  camera preview.

## Development principles

- IndexedDB is the source of truth for meal history; do not add a remote meal
  database to the proxy backend.
- Calculate nutritional totals instead of storing them redundantly.
- Keep API keys in backend environment variables, never in frontend code.
- Implement manual tracking before external integrations.
- Prioritize working core functionality over optional features.
- Follow the existing architecture, schema, and Dexie reference; discuss major
  architectural changes before introducing them.

See the [architecture](../architecture.md) for responsibilities and planned flows.
