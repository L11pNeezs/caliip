import { db } from './index'
import type { Meal } from '../types/meal'

export async function addMeal(meal: Meal): Promise<number> {
    if (!meal.name.trim()) throw new Error('Enter a meal name.')
    if (!meal.date) throw new Error('Enter a meal date.')

    const id = await db.meals.add({
        name: meal.name.trim(),
        date: meal.date,
        source: meal.source,
        createdAt: meal.createdAt,
    })

    return id
}

export async function getMealsForDate(date?: string): Promise<Meal[]> {
    if (!date) {
        return db.meals.orderBy('date').reverse().toArray()
    }

    return db.meals.where('date').equals(date).toArray()
}

export async function getMeal(mealId: number): Promise<Meal | undefined> {
    if (!(mealId > 0)) return undefined
    return db.meals.get(mealId)
}
