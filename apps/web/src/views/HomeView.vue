<script setup lang="ts">
import { useApiHealth } from '../composables/useApiHealth'

const { status } = useApiHealth()

function addMealManually() {

}
</script>

<template>
  <v-card class="mx-auto pa-6" max-width="680" variant="outlined">
    <v-card-title class="text-h4 text-wrap">Welcome to Caliip</v-card-title>
    <v-card-text>
      <p class="text-body-1 mb-6">
        Add a meal, and keep your meal history on this device.
      </p>
      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="primary">Add meal</v-btn>
          </template>

          <v-list>
            <v-list-item
                title="Manually"
                :to="{ name: 'new-meal', params: { mode: 'manual'} }"
            />

            <v-list-item
                title="Auto by Camera"
                :to="{ name: 'new-meal', params: { mode: 'camera'} }"
            />

            <v-list-item
                title="Auto by Voice"
                :to="{ name: 'new-meal', params: { mode: 'voice'} }"
            />
          </v-list>
        </v-menu>

        <v-btn :to="{ name: 'meals' }" variant="outlined">View meals</v-btn>
      </div>
      <v-chip :color="status === 'available' ? 'primary' : undefined">
        API: {{ status }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
