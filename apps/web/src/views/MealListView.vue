<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMeals } from '../db/meals'
import type { Meal } from '../types/meal'

const meals = ref<Meal[]>([])
const loading = ref(true)
const error = ref('')

async function loadMeals() {
  loading.value = true
  error.value = ''
  try {
    meals.value = await getMeals()
  } catch {
    error.value = 'Could not load your meals. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMeals)
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="800" variant="outlined">
    <v-card-title class="text-h4">Your meals</v-card-title>
    <v-card-text>
      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-btn :to="{ name: 'new-meal', params: { mode: 'manual' }}" color="primary">Add meal</v-btn>
        <v-btn :to="{ name: 'home' }" variant="text">Home</v-btn>
      </div>
      <p v-if="loading" role="status">Loading meals…</p>
      <v-alert v-else-if="error" type="error">
        {{ error }}
        <v-btn variant="text" @click="loadMeals">Retry</v-btn>
      </v-alert>
      <p v-else-if="meals.length === 0">No meals yet. Add your first meal to get started.</p>
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
