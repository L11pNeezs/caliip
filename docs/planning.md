# Development plan

**Status:** Initial outline based on the original root `requirements`,
`architecture`, and `decisions` documents. The project has an 80-hour development
budget; detailed estimates and scheduling remain to be defined.

## 1. Project foundation — completed

- Configure Bun workspaces and the frontend/backend stack.
- Provide local frontend-to-backend communication and environment configuration.
- Configure type checks, Vitest, production builds, and PWA assets.
- Verify that both applications start locally.
- Establish architecture, schema, and decision documentation.

## 2. Local manual tracking — planned

- Implement the documented Dexie schema and domain interfaces.
- Add meal and food-entry CRUD with manual nutritional input.
- Calculate calorie and macronutrient totals from food entries.
- Add targeted database and calculation tests, using fake-indexeddb if needed.

## 3. Calendar overviews — planned

- Build daily, weekly, and monthly navigation and numerical totals.
- Use date-fns with explicit local calendar dates.
- Verify date aggregation and access to saved meals offline.

## 4. External integrations — planned after manual tracking

- Add USDA food search through the Bun backend.
- Add HTML file-input photo capture and OpenAI analysis through Bun.
- Validate external requests and uploads and apply reasonable request limits.
- Let users review and correct AI estimates before saving locally.

## 5. Evaluation and report — planned

- Verify core flows, offline behavior, and production configuration.
- Update the [project report](report.md) with results and limitations.
- Consider optional voice input only after core workflows are working and if
  time permits.

The current implementation stops at the foundation stage. Follow the
[technology decisions](decisions/README.md) and keep the architecture minimal.
