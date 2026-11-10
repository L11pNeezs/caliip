import { describe, expect, it } from 'vitest'
import { calculateNutritionTotals } from './nutrition'
import type { FoodEntry } from '../types/food-entry'

describe('daily nutrition totals', () => {
  it('sums quantity-adjusted nutrition across entries from multiple meals', () => {
    const entries: FoodEntry[] = [
      {
        mealId: 1, name: 'Rice', quantityGrams: 150,
        caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3,
      },
      {
        mealId: 1, name: 'Chicken', quantityGrams: 200,
        caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6,
      },
      {
        mealId: 2, name: 'Yogurt', quantityGrams: 125,
        caloriesPer100g: 60, proteinPer100g: 4, carbsPer100g: 6, fatPer100g: 2,
      },
    ]

    const totals = calculateNutritionTotals(entries)
    expect(totals.calories).toBeCloseTo(600)
    expect(totals.protein).toBeCloseTo(71.05)
    expect(totals.carbs).toBeCloseTo(49.5)
    expect(totals.fat).toBeCloseTo(10.15)
  })

  it('preserves precision for fractional gram quantities', () => {
    const totals = calculateNutritionTotals([{
      mealId: 1, name: 'Rice', quantityGrams: 150.5,
      caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3,
    }])

    expect(totals.calories).toBeCloseTo(195.65, 6)
    expect(totals.protein).toBeCloseTo(4.0635, 6)
    expect(totals.carbs).toBeCloseTo(42.14, 6)
    expect(totals.fat).toBeCloseTo(0.4515, 6)
  })

  it('returns zero totals for a day without food entries', () => {
    expect(calculateNutritionTotals([])).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  })
})
