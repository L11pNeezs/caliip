# Dexie schema reference

The following code reproduces the original root
`dexie.js implementation of data schema` document. It is a reference for future
implementation, not executable application code in the current scaffold.
The setup requirements explicitly defer database tables.

```ts
import Dexie, { type EntityTable } from 'dexie'

export interface Meal {
  id?: number
  date: string // YYYY-MM-DD
  name: string
  source: 'manual' | 'ai'
  createdAt: string // ISO 8601
}

export interface FoodEntry {
  id?: number
  mealId: number
  name: string
  quantityGrams: number
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

export const db = new Dexie('CaliipDB') as Dexie & {
  meals: EntityTable<Meal, 'id'>
  foodEntries: EntityTable<FoodEntry, 'id'>
}

db.version(1).stores({
  meals: '++id, date',
  foodEntries: '++id, mealId'
})
```

- Database name: `CaliipDB`.
- Version 1: auto-incrementing numeric keys on both tables.
- `meals.date` supports calendar-date queries.
- `foodEntries.mealId` supports retrieving the entries belonging to a meal.
- Non-indexed properties remain stored on the records.

When database work begins, put the setup in `apps/web/src/db/` and domain
interfaces in `apps/web/src/types/`, following the documented folder structure.
See the [data schema](data-schema.md) and
[database decision](decisions/001-database.md).
