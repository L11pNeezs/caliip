# Data schema

This is the planned model from the original root `data schema` and
`dexie.js implementation of data schema` documents. Database tables are not
initialized by the current scaffold.

## Meal

Groups food entries into a meal, such as breakfast, lunch, or dinner.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `number` | Auto-incrementing primary key; optional before insertion |
| `name` | `string` | Meal name |
| `date` | `string` | Local calendar date, `YYYY-MM-DD` |
| `source` | `'manual' \| 'ai'` | How the meal was entered |
| `createdAt` | `string` | ISO 8601 creation timestamp |

## FoodEntry

Stores the quantity consumed and nutritional values per 100 grams.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `number` | Auto-incrementing primary key; optional before insertion |
| `mealId` | `number` | Reference to `Meal.id` |
| `name` | `string` | Food name |
| `quantityGrams` | `number` | Consumed quantity in grams |
| `caloriesPer100g` | `number` | Calories per 100 grams |
| `proteinPer100g` | `number` | Protein in grams per 100 grams |
| `carbsPer100g` | `number` | Carbohydrates in grams per 100 grams |
| `fatPer100g` | `number` | Fat in grams per 100 grams |

One meal has zero or more food entries; each food entry belongs to one meal.
For example, lunch with 150 g of chicken and 200 g of rice is one `Meal` with
two `FoodEntry` records. IndexedDB does not enforce foreign keys; future CRUD
logic must maintain this relationship.

## Calculated values

Store nutritional values directly on each food entry for offline access. Derive
consumed calories rather than storing redundant totals:

```text
calories = (quantityGrams * caloriesPer100g) / 100
```

Use the same formula for protein, carbohydrates, and fat, substituting their
per-100-gram values. Meal and period totals are sums of the relevant entries.

Use local calendar dates for grouping to avoid timezone-related date shifts.

## Deferred model

The original document explicitly excludes `FoodCatalog` and `foodCatalogId`
from the current scope. They are not part of this schema.

See the [Dexie reference](dexie-schema.md) for the database name and indexes,
and the [database decision](decisions/001-database.md) for the rationale.
