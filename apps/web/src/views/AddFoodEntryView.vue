<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodEntries } from '../composables/useFoodEntries'

const props = defineProps<{
  mealId: string
}>()

const router = useRouter()
const { saving, error, meal, loading, loadMeal, saveFoodEntry } = useFoodEntries()

onMounted(() => loadMeal(Number(props.mealId)))

const form = reactive({
  name: '',
  quantityGrams: 100,
  caloriesPer100g: 0,
  proteinPer100g: 0,
  carbsPer100g: 0,
  fatPer100g: 0,
})

async function handleSubmit() {
  if (!meal.value) return

  const saved = await saveFoodEntry({
    ...form,
    mealId: Number(props.mealId),
  })

  if (saved) {
    await router.push({ name: 'meal', params: { mealId: props.mealId } })
  }
}
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="600">
    <v-card-title class="text-wrap">Add food{{ meal ? ` to ${meal.name}` : '' }}</v-card-title>

    <v-card-text>
      <p v-if="loading" role="status">Loading meal…</p>
      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <v-form v-if="meal && !loading" @submit.prevent="handleSubmit">
        <v-text-field
            v-model="form.name"
            label="Food name"
        />

        <v-text-field
            v-model.number="form.quantityGrams"
            label="Quantity (g)"
            type="number"
            inputmode="decimal"
            step="any"
            persistent-placeholder
        />

        <v-text-field
            v-model.number="form.caloriesPer100g"
            label="Calories per 100 g (kcal)"
            type="number"
            inputmode="decimal"
            step="any"
            persistent-placeholder
        />

        <v-text-field
            v-model.number="form.proteinPer100g"
            label="Protein per 100 g (g)"
            type="number"
            inputmode="decimal"
            step="any"
            persistent-placeholder
        />

        <v-text-field
            v-model.number="form.carbsPer100g"
            label="Carbohydrates per 100 g (g)"
            type="number"
            inputmode="decimal"
            step="any"
            persistent-placeholder
        />

        <v-text-field
            v-model.number="form.fatPer100g"
            label="Fat per 100 g (g)"
            type="number"
            inputmode="decimal"
            step="any"
            persistent-placeholder
        />

        <v-btn
            type="submit"
            color="primary"
            :loading="saving"
            :disabled="saving"
        >
          Add food
        </v-btn>
      </v-form>
      <v-btn :to="meal ? { name: 'meal', params: { mealId } } : { name: 'meals' }"
        variant="text" class="mt-4" :disabled="saving">
        {{ meal ? 'Back to meal' : 'Back to meals' }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
