<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { getMealsForDate } from '../db/meals'
import { getFoodEntriesForMeal } from '../db/foodEntries'
import type { Meal } from '../types/meal'

const meals = ref<Meal[]>([])
const dailyCalories = ref(0)
const loading = ref(true)
const error = ref('')

const date = ref(new Date())
const draftDate = ref<Date | null>(null)
const calendarOpen = ref(false)

const calendarIcons = {
  previous: ['M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z'],
  next: ['M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z'],
  dropdown: ['M7 10l5 5 5-5z'],
}

function confirmDate() {
  if (!draftDate.value) return

  date.value = new Date(draftDate.value.getTime())
  calendarOpen.value = false
}

function changeDay(offset: number) {
  const nextDate = new Date(date.value.getTime())
  nextDate.setDate(nextDate.getDate() + offset)
  date.value = nextDate
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function loadMeals() {
  loading.value = true
  error.value = ''
  try {
    const dayMeals = await getMealsForDate(formatLocalDate(date.value))
    const entriesByMeal = await Promise.all(dayMeals.map(meal =>
      meal.id !== undefined ? getFoodEntriesForMeal(meal.id) : Promise.resolve([]),
    ))
    const calories = entriesByMeal.flat().reduce((total, entry) =>
      total + entry.quantityGrams * entry.caloriesPer100g / 100, 0,
    )

    meals.value = dayMeals
    dailyCalories.value = calories
  } catch {
    error.value = 'Could not load your meals. Please try again.'
  } finally {
    loading.value = false
  }
}

watch(date, loadMeals)
watch(calendarOpen, (open) => {
  if (open) draftDate.value = new Date(date.value.getTime())
})

onMounted(loadMeals)
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="800" variant="outlined">
    <v-card-title class="text-h4">Your meals</v-card-title>
    <v-card-text>
      <div class="d-flex align-center justify-center ga-3 mb-6">
        <v-btn variant="text" aria-label="Previous day" :disabled="loading" @click="changeDay(-1)">
          ←
        </v-btn>
        <v-menu
          v-model="calendarOpen"
          :close-on-content-click="false"
          location="bottom center"
          origin="top center"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" aria-label="Pick a date">
              <span aria-live="polite">
                {{ date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
              </span>
            </v-btn>
          </template>

          <v-card>
            <v-date-picker
              v-model="draftDate"
              title="Filter meals by date"
              :prev-icon="calendarIcons.previous"
              :next-icon="calendarIcons.next"
              :mode-icon="calendarIcons.dropdown"
              hide-header
            />
            <v-card-text class="d-flex justify-space-evenly ga-2">
              <v-btn variant="text" @click="calendarOpen = false">Cancel</v-btn>
              <v-btn color="primary" :disabled="!draftDate" @click="confirmDate">
                {{ draftDate ? `Show ${formatLocalDate(draftDate)}` : 'Select a date' }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-btn variant="text" aria-label="Next day" :disabled="loading" @click="changeDay(1)">
          →
        </v-btn>
      </div>
      <p v-if="!loading && !error" class="text-h6 text-center mb-6" aria-live="polite">
        Daily total: {{ dailyCalories.toFixed(1) }} kcal
      </p>
      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-btn :to="{ name: 'new-meal', params: { mode: 'manual' }}" color="primary">Add meal</v-btn>
        <v-btn :to="{ name: 'home' }" variant="text">Home</v-btn>
      </div>

      <p v-if="loading" role="status">Loading meals…</p>

      <v-alert v-else-if="error" type="error">
        {{ error }}
        <v-btn variant="text" @click="loadMeals">Retry</v-btn>
      </v-alert>

      <p v-else-if="meals.length === 0">No meals for this date.</p>
      <template v-else>
        <v-card v-for="meal in meals" :key="meal.id" variant="outlined" class="mb-3">
          <v-card-title class="text-wrap">{{ meal.name }}</v-card-title>

          <v-card-text>
            <p class="mb-3">{{ meal.date }}</p>

            <v-btn :to="{ name: 'meal', params: { mealId: meal.id } }" variant="tonal">
              View meal
            </v-btn>
          </v-card-text>
        </v-card>
      </template>
    </v-card-text>
  </v-card>
</template>
