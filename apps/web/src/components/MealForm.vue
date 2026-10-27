<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { addMeal } from '../db/meals'

const router = useRouter()

const name = ref('')
const date = ref(format(new Date(), 'yyyy-MM-dd'))
const saving = ref(false)
const error = ref('')

async function handleSubmit() {
  if (saving.value) return

  error.value = ''

  if (!name.value.trim() || !date.value) {
    error.value = 'Enter a meal name and date.'
    return
  }

  saving.value = true

  try {
    const mealId = await addMeal({
      name: name.value.trim(),
      date: date.value,
      source: 'manual',
      createdAt: new Date().toISOString(),
    })

    await router.push({
      name: 'meal',
      params: { mealId: mealId },
    })
  } catch {
    error.value = 'Could not create the meal. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="600">
    <v-card-title>Create a meal</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
            v-model="name"
            label="Meal name"
            placeholder="For example, Lunch"
        />

        <v-text-field
            v-model="date"
            label="Date"
            type="date"
        />

        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn
            type="submit"
            color="primary"
            :loading="saving"
            :disabled="saving"
        >
          Add meal
        </v-btn>
      </v-form>
      <v-btn :to="{ name: 'home' }" variant="text" class="mt-4" :disabled="saving">
        Home
      </v-btn>
    </v-card-text>
  </v-card>
</template>
