<script setup lang="ts">
import { useApiHealth } from '../composables/useApiHealth'

const { status } = useApiHealth()
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="680" variant="outlined">
    <v-card-title class="text-h4 text-wrap">Welcome to Caliip</v-card-title>
    <v-card-text>
      <p class="text-body-1 mb-6">
        Create a meal, enter foods manually, and keep your meal history on this device.
      </p>
      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-btn :to="{ name: 'new-meal' }" color="primary">Create meal</v-btn>
        <v-btn :to="{ name: 'meals' }" variant="outlined">View meals</v-btn>
      </div>
      <v-chip :color="status === 'available' ? 'primary' : undefined">
        API: {{ status }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
