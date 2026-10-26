import 'fake-indexeddb/auto'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { db } from './index'
import { addMeal, getMeal, getMeals } from './meals'
import { addFoodEntry, getFoodEntriesForMeal, removeFoodEntry } from './foodEntries'
import type { FoodEntry } from '../types/food-entry'

const mealInput = {
  name: 'Lunch',
  date: '2026-10-26',
  source: 'manual' as const,
  createdAt: '2026-10-26T12:00:00.000Z',
}

function foodInput(mealId: number): FoodEntry {
  return {
    mealId, name: 'Rice', quantityGrams: 150.5,
    caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0,
  }
}

beforeEach(async () => {
  await db.transaction('rw', db.meals, db.foodEntries, async () => {
    await db.foodEntries.clear()
    await db.meals.clear()
  })
})

afterAll(() => db.delete())

describe('manual meal persistence', () => {
  it('generates numeric keys and retains meals and foods after reopening the database', async () => {
    const mealId = await addMeal({ ...mealInput, name: ' Lunch ' })
    const entryId = await addFoodEntry({ ...foodInput(mealId), name: ' Rice ' })
    expect(typeof mealId).toBe('number')
    expect(typeof entryId).toBe('number')

    db.close()
    await db.open()

    expect(await getMeal(mealId)).toEqual({ ...mealInput, id: mealId })
    expect(await getFoodEntriesForMeal(mealId)).toEqual([
      { ...foodInput(mealId), id: entryId },
    ])
  })

  it('lists meals with newest local dates first', async () => {
    const earlier = await addMeal({ ...mealInput, date: '2026-10-25' })
    const later = await addMeal(mealInput)
    expect((await getMeals()).map(meal => meal.id)).toEqual([later, earlier])
  })

  it('rejects an empty meal date without inserting a meal', async () => {
    await expect(addMeal({ ...mealInput, date: '' })).rejects.toThrow('meal date')
    expect(await db.meals.count()).toBe(0)
  })

  it('rejects an empty meal name', async () => {
    await expect(addMeal({ ...mealInput, name: '  ' })).rejects.toThrow('meal name')
  })

  it('returns no meal for invalid or missing IDs', async () => {
    expect(await getMeal(NaN)).toBeUndefined()
    expect(await getMeal(-1)).toBeUndefined()
    expect(await getMeal(999)).toBeUndefined()
  })
})

describe('manual food entry', () => {
  it('loads only the selected meal’s food entries', async () => {
    const first = await addMeal(mealInput)
    const second = await addMeal({ ...mealInput, name: 'Dinner' })
    await addFoodEntry(foodInput(first))
    await addFoodEntry({ ...foodInput(second), name: 'Chicken' })

    const entries = await getFoodEntriesForMeal(first)
    expect(entries).toHaveLength(1)
    expect(entries[0]?.name).toBe('Rice')
  })

  it('rejects an orphaned food entry without saving any record', async () => {
    await expect(addFoodEntry(foodInput(999))).rejects.toThrow('Meal not found')
    expect(await db.foodEntries.count()).toBe(0)
  })

  it.each([0, -1, NaN, '' as unknown as number])(
    'rejects invalid quantity %j', async quantityGrams => {
      const mealId = await addMeal(mealInput)
      await expect(addFoodEntry({ ...foodInput(mealId), quantityGrams }))
        .rejects.toThrow('Quantity')
      expect(await db.foodEntries.count()).toBe(0)
    },
  )

  it.each(['caloriesPer100g', 'proteinPer100g', 'carbsPer100g', 'fatPer100g'] as const)(
    'rejects negative, blank, and non-numeric values for %s', async field => {
      const mealId = await addMeal(mealInput)
      for (const value of [-1, NaN, '']) {
        await expect(addFoodEntry({ ...foodInput(mealId), [field]: value }))
          .rejects.toThrow('Nutritional values')
      }
      expect(await db.foodEntries.count()).toBe(0)
    },
  )

  it('rejects a blank food name', async () => {
    const mealId = await addMeal(mealInput)
    await expect(addFoodEntry({ ...foodInput(mealId), name: '  ' }))
      .rejects.toThrow('food name')
  })

  it('allows zero nutrition values and fractional gram quantities', async () => {
    const mealId = await addMeal(mealInput)
    await addFoodEntry({
      ...foodInput(mealId), quantityGrams: 0.5, caloriesPer100g: 0,
      proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0,
    })
    expect(await getFoodEntriesForMeal(mealId)).toHaveLength(1)
  })

  it('removes only the selected entry and keeps an empty meal', async () => {
    const mealId = await addMeal(mealInput)
    const first = await addFoodEntry(foodInput(mealId))
    const second = await addFoodEntry({ ...foodInput(mealId), name: 'Chicken' })

    await removeFoodEntry(first)
    expect((await getFoodEntriesForMeal(mealId)).map(entry => entry.id)).toEqual([second])

    await removeFoodEntry(second)
    db.close()
    await db.open()
    expect(await getFoodEntriesForMeal(mealId)).toEqual([])
    expect(await getMeal(mealId)).toBeDefined()
  })
})
