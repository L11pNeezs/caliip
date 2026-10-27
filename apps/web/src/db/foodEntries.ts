import { db } from './index'
import type { FoodEntry } from '../types/food-entry'

export async function addFoodEntry(entry: FoodEntry): Promise<number> {
    if (!entry.name.trim()) throw new Error('Enter a food name.')
    if (!(entry.mealId > 0)) {
        throw new Error('Invalid meal ID.')
    }
    if (!(entry.quantityGrams > 0)) {
        throw new Error('Quantity must be a positive number.')
    }
    const nutrition = [
        entry.caloriesPer100g, entry.proteinPer100g,
        entry.carbsPer100g, entry.fatPer100g,
    ]
    if (nutrition.some(value => typeof value !== 'number' || !(value >= 0))) {
        throw new Error('Nutritional values must be nonnegative numbers.')
    }

    if (!await db.meals.get(entry.mealId)) {
        throw new Error('Meal not found.')
    }
    return db.foodEntries.add({
        mealId: entry.mealId,
        name: entry.name.trim(),
        quantityGrams: entry.quantityGrams,
        caloriesPer100g: entry.caloriesPer100g,
        proteinPer100g: entry.proteinPer100g,
        carbsPer100g: entry.carbsPer100g,
        fatPer100g: entry.fatPer100g,
    })
}

export async function removeFoodEntry(id: number): Promise<void> {
    if (!(id > 0)) throw new Error('Invalid food entry ID.')
    await db.foodEntries.delete(id)
}

export async function getFoodEntriesForMeal(mealId: number): Promise<FoodEntry[]> {
    return db.foodEntries
        .where('mealId')
        .equals(mealId)
        .toArray()
}
