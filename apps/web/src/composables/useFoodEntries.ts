import { ref } from 'vue'
import { addFoodEntry, getFoodEntriesForMeal, removeFoodEntry } from '../db/foodEntries'
import { getMeal } from '../db/meals'
import type { FoodEntry } from '../types/food-entry'
import type { Meal } from '../types/meal'

export function useFoodEntries() {
    const saving = ref(false)
    const error = ref('')
    const meal = ref<Meal>()
    const entries = ref<FoodEntry[]>([])
    const loading = ref(false)
    const removingId = ref<number | null>(null)

    async function loadMeal(mealId: number) {
        loading.value = true
        error.value = ''
        meal.value = undefined
        entries.value = []

        try {
            meal.value = await getMeal(mealId)
            if (!meal.value) {
                error.value = 'Meal not found.'
                return
            }
            entries.value = await getFoodEntriesForMeal(mealId)
        } catch {
            error.value = 'Could not load this meal. Please try again.'
        } finally {
            loading.value = false
        }
    }

    async function saveFoodEntry(entry: FoodEntry): Promise<boolean> {
        if (saving.value) return false

        saving.value = true
        error.value = ''

        try {
            await addFoodEntry(entry)
            return true
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Could not save the food entry.'
            return false
        } finally {
            saving.value = false
        }
    }

    async function deleteFoodEntry(id: number) {
        if (removingId.value !== null) return

        removingId.value = id
        error.value = ''

        try {
            await removeFoodEntry(id)
            entries.value = entries.value.filter(entry => entry.id !== id)
        } catch {
            error.value = 'Could not remove the food entry. Please try again.'
        } finally {
            removingId.value = null
        }
    }

    return { saving, error, meal, entries, loading, removingId, loadMeal, saveFoodEntry, deleteFoodEntry }
}
