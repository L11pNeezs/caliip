<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import { VCardActions, VDialog } from 'vuetify/components'
import { useFoodEntries } from '../composables/useFoodEntries'

const props = defineProps<{ mealId: string }>()
const { meal, entries, loading, error, removingId, loadMeal, deleteFoodEntry } = useFoodEntries()
const confirmationOpen = ref(false)
const pendingRemoval = ref<{ id: number; name: string }>()

function requestRemoval(id: number, name: string) {
  pendingRemoval.value = { id, name }
  confirmationOpen.value = true
}

async function confirmRemoval() {
  if (!pendingRemoval.value || removingId.value !== null) return
  await deleteFoodEntry(pendingRemoval.value.id)
  confirmationOpen.value = false
  pendingRemoval.value = undefined
}

const totals = computed(() => entries.value.reduce((total, entry) => {
  const factor = entry.quantityGrams / 100
  total.calories += factor * entry.caloriesPer100g
  total.protein += factor * entry.proteinPer100g
  total.carbs += factor * entry.carbsPer100g
  total.fat += factor * entry.fatPer100g
  return total
}, { calories: 0, protein: 0, carbs: 0, fat: 0 }))

onMounted(() => {loadMeal(Number(props.mealId))})
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="800" variant="outlined">
    <v-card-text>
      <v-btn :to="{ name: 'meals' }" variant="text" class="mb-4">Back to meals</v-btn>
      <p v-if="loading" role="status">Loading meal…</p>
      <template v-else>
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
          <v-btn variant="text" @click="loadMeal(Number(mealId))">Retry</v-btn>
        </v-alert>
        <template v-if="meal">
          <h1 class="text-h4 mb-2">{{ meal.name }}</h1>
          <p class="mb-4">{{ meal.date }}</p>
          <v-btn :to="{ name: 'add-food-entry', params: { mealId } }" color="primary" class="mb-6">
            Add food
          </v-btn>
          <p v-if="entries.length === 0">No food entries yet. Add a food to this meal.</p>
          <v-card v-for="entry in entries" :key="entry.id" variant="outlined" class="mb-3">
            <v-card-title class="text-wrap">{{ entry.name }}</v-card-title>
            <v-card-text>
              <p>{{ entry.quantityGrams }} g · {{ (entry.quantityGrams * entry.caloriesPer100g / 100).toFixed(1) }} kcal</p>
              <p class="mb-3">
                Per 100 g: {{ entry.caloriesPer100g }} kcal · Protein {{ entry.proteinPer100g }} g ·
                Carbs {{ entry.carbsPer100g }} g · Fat {{ entry.fatPer100g }} g
              </p>
              <v-btn v-if="entry.id !== undefined" color="error" variant="outlined"
                :aria-label="`Remove ${entry.name}`" :loading="removingId === entry.id"
                :disabled="removingId !== null" @click="requestRemoval(entry.id, entry.name)">
                Remove
              </v-btn>
            </v-card-text>
          </v-card>
          <div class="mt-6" aria-live="polite">
            <h2 class="text-h6">Meal totals</h2>
            <p>{{ totals.calories.toFixed(1) }} kcal</p>
            <p>Protein {{ totals.protein.toFixed(1) }} g · Carbs {{ totals.carbs.toFixed(1) }} g · Fat {{ totals.fat.toFixed(1) }} g</p>
          </div>
        </template>
      </template>
    </v-card-text>
  </v-card>

  <v-dialog v-model="confirmationOpen" max-width="440" :persistent="removingId !== null"
    aria-labelledby="remove-food-title" aria-describedby="remove-food-description">
    <v-card>
      <v-card-title id="remove-food-title">Remove food?</v-card-title>
      <v-card-text id="remove-food-description">
        Remove “{{ pendingRemoval?.name }}” from this meal? This cannot be undone.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" :disabled="removingId !== null" @click="confirmationOpen = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" :loading="removingId !== null"
          :disabled="removingId !== null" @click="confirmRemoval">
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
