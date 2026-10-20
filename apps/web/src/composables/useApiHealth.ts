import { onMounted, ref } from 'vue'
import { checkApiHealth } from '../services/api'

export function useApiHealth() {
  const status = ref<'checking' | 'available' | 'unavailable'>('checking')

  onMounted(async () => {
    try {
      await checkApiHealth()
      status.value = 'available'
    } catch {
      status.value = 'unavailable'
    }
  })

  return { status }
}
