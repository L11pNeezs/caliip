# Test reference

Use this page to understand existing automated tests and locate the code to
inspect when one fails. Add a section here when introducing a new test file.

## Running tests

From the repository root:

```sh
bun run test

# Run one file:
bun run --filter @caliip/web test src/db/manual-entry.test.ts
bun run --filter @caliip/web test src/services/api.test.ts

# Watch files and rerun tests after changes:
bun run --filter @caliip/web test:watch
```

Tests use **Vitest**, configured in `apps/web/vite.config.ts`. Files matching
`src/**/*.test.ts` run in a Node environment; no running frontend or API server
is required. Install dependencies with `bun install` first.

## CAL-3: Manual entry and persistence

**File:** [manual-entry.test.ts](../apps/web/src/db/manual-entry.test.ts)

**Setup:** `fake-indexeddb/auto` provides in-memory IndexedDB for the real Dexie
database functions. Both tables are cleared before each test; the test database
is deleted after the suite. This does not access browser meal history. Closing
and reopening the database tests persistence within the same test process, not
browser restarts or on-disk durability.

Parameterized cases produce **22 tests** in this file.

| Test/scenario | Expected behavior | Inspect if it fails |
| --- | --- | --- |
| Generated keys and reopening | Meal/food IDs are numbers; names are trimmed; all saved fields survive closing and reopening | `db/index.ts`, `addMeal()`, `addFoodEntry()` |
| Meal ordering | Meals are returned with the newest local date first | `getMeals()` and the `date` index |
| Invalid meal dates (4 cases) | Empty, impossible, invalid-month, and incorrectly formatted dates are rejected; no meal is saved | Date validation in `addMeal()` |
| Empty meal name | Whitespace-only meal names are rejected | Name validation in `addMeal()` |
| Invalid/missing meal IDs | `NaN`, negative, and nonexistent IDs return `undefined` | `getMeal()` |
| Foods scoped to a meal | Querying one meal returns only its foods | `getFoodEntriesForMeal()` and the `mealId` index |
| Missing parent meal | Food insertion fails and saves no food when its meal does not exist | Meal-existence check and transaction in `addFoodEntry()` |
| Invalid quantities (5 cases) | Zero, negative, `NaN`, infinite, and blank quantities are rejected without saving | Quantity validation in `addFoodEntry()` |
| Invalid nutrition (4 fields) | Each calorie/macro field rejects negative, blank, `NaN`, and infinite values without saving | Nutrition validation in `addFoodEntry()` |
| Blank food name | Whitespace-only food names are rejected | Name validation in `addFoodEntry()` |
| Valid zero/decimal values | Zero calories/macros and a positive fractional gram quantity are accepted | Numeric validation in `addFoodEntry()` |
| Food removal | Only the selected food is removed; removing the last food keeps the empty meal after reopening | `removeFoodEntry()` |

Implementation files: [meals.ts](../apps/web/src/db/meals.ts),
[foodEntries.ts](../apps/web/src/db/foodEntries.ts), and
[database setup](../apps/web/src/db/index.ts).

## Development API health client

**File:** [api.test.ts](../apps/web/src/services/api.test.ts) — **2 tests**.

**Setup:** Vitest replaces global `fetch` with a mock. The test configuration
restores global stubs between tests. These tests do not contact Bun or verify
that Vite's proxy actually works.

| Test/scenario | Expected behavior | Inspect if it fails |
| --- | --- | --- |
| Successful response | Calls `/api/health`; a mocked HTTP 200 response resolves without an error | URL and response handling in `checkApiHealth()` |
| Unsuccessful response | A mocked HTTP 503 response rejects with `API health check failed (503).` | Error handling in `checkApiHealth()` |

Implementation: [services/api.ts](../apps/web/src/services/api.ts).

## Troubleshooting

1. Read the failing test name and Vitest's **expected/received** output.
2. Run only that file using the commands above to isolate the failure.
3. Inspect the implementation listed in the tables before changing assertions.
   Update expectations only when the intended behavior has actually changed.
4. For database setup errors, confirm `fake-indexeddb/auto` is imported before
   the database modules, dependencies are installed, and the schema is correct.
5. For TypeScript errors, run `bun run check` separately; passing tests do not
   replace type checking.

These suites do **not** test Vue rendering, form interaction, calculated meal
totals, the removal confirmation dialog, service workers, or real API requests.
Those require separate tests or browser verification.

## Documenting future tests

Add a short section using this template and update it whenever behavior changes:

```md
## Story or feature name

**File:** link to the test file
**Setup:** required mocks, fixtures, and cleanup

| Test/scenario | Expected behavior | Inspect if it fails |
| --- | --- | --- |
| Descriptive test name | Observable result | Relevant function/file |

**Limits:** behavior this suite does not verify
```

Keep scenario names recognizable from the test output. For parameterized tests,
list the inputs or summarize the cases so failures are easy to identify.
