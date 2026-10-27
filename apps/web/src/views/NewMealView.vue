<script setup lang="ts">
import MealForm from '../components/MealForm.vue'
import MealCameraCapture from '../components/MealCameraCapture.vue'
import MealVoiceCapture from '../components/MealVoiceCapture.vue'

defineProps({
  mode: {
    type: String,
    required: true,
  },
})

</script>

<template>
  <v-container>
    <MealForm v-if="mode === 'manual'" />
    <MealCameraCapture v-else-if="mode === 'camera'" />
    <MealVoiceCapture v-else-if="mode === 'voice'" />
  </v-container>
</template>
