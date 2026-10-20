<script setup lang="ts">
import { useApiHealth } from '../composables/useApiHealth'

const { status } = useApiHealth()
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="680" variant="outlined">
    <v-card-title class="text-h4 text-wrap">Welcome to Caliip</v-card-title>
    <v-card-text>
      <p class="text-body-1 mb-6">
        The foundation for a local-first calorie-tracking app is ready.
        Meal tracking and external integrations will be added later.
      </p>
      <v-chip :color="status === 'available' ? 'primary' : undefined">
        API: {{ status }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
