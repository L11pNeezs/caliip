import Dexie, { type Table } from 'dexie'
import type { Meal } from '../types/meal'
import type { FoodEntry } from '../types/food-entry'

export const db = new Dexie('CaliipDB') as Dexie & {
    meals: Table<Meal, number>
    foodEntries: Table<FoodEntry, number>
}

db.version(1).stores({
    meals: '++id, date',
    foodEntries: '++id, mealId',
})
