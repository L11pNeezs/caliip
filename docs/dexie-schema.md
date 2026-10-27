# Dexie schema reference

CAL-3 implements the schema from the original root
`dexie.js implementation of data schema` document in `apps/web/src/db/index.ts`.
Interfaces live in `apps/web/src/types/`. The example below shows the combined
definition for reference.

`Table<Entity, number>` explicitly declares numeric primary keys while allowing
`id` to remain optional before insertion. This avoids inferring the return key
as `number | undefined` from `EntityTable<Entity, 'id'>` with optional IDs.
This TypeScript adjustment does not change the version-1 database structure.

```ts
import Dexie, { type Table } from 'dexie'

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
  meals: Table<Meal, number>
  foodEntries: Table<FoodEntry, number>
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

Persistence operations are in `apps/web/src/db/meals.ts` and `foodEntries.ts`.
Insertion functions omit caller-supplied IDs so IndexedDB generates new keys.
See the [data schema](data-schema.md) and
[database decision](decisions/001-database.md).
