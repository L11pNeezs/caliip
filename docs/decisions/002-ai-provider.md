# 002: OpenAI and USDA through the Bun backend

**Status:** Accepted for future implementation; integrations are not implemented.

## Context

Photo-based entry needs food identification and quantity estimation. Nutritional
values need a reference source. External API keys must remain server-side.

## Decision

Use OpenAI for image analysis, returning structured food names and estimated
quantities in grams. Use one application-managed key, rather than asking users
to supply their own. Users must review and correct estimates before saving.

Use USDA FoodData Central as the initial nutritional reference. Its broad food
coverage, JSON search API, and an available API key make it convenient for this
project. Store the selected values on food entries for offline access.

Proxy both services through Bun using native Fetch:

- `POST /api/analyze-meal`: future OpenAI photo analysis.
- `GET /api/foods/search`: future USDA food search.

Keep keys in backend environment variables. When implementing the endpoints,
validate uploads and requests and apply reasonable request limits. The backend
must not persist meal history.

## Alternative considered

CIQUAL, maintained by ANSES in France, provides reliable data relevant to French
and European foods. Its downloadable dataset would require conversion and
normalization, and it does not offer a comparable ready-to-use search API.
USDA is the simpler initial integration within the project budget.

## Consequences

- External analysis and lookup require a network connection.
- AI quantities are estimates, not guaranteed measurements.
- Manual entry remains the core workflow and should be implemented first.
- Keys remain protected by the backend rather than shipped to the browser.

## References

- [Architecture and planned data flows](../architecture.md)
- Original root `decisions` document.
