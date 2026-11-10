import type { FoodEntry } from '../types/food-entry'

export function calculateNutritionTotals(entries: readonly FoodEntry[]) {
  return entries.reduce((total, entry) => {
    const factor = entry.quantityGrams / 100
    total.calories += factor * entry.caloriesPer100g
    total.protein += factor * entry.proteinPer100g
    total.carbs += factor * entry.carbsPer100g
    total.fat += factor * entry.fatPer100g
    return total
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
}
