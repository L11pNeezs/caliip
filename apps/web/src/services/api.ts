export async function checkApiHealth(): Promise<void> {
  const response = await fetch('/api/health')

  if (!response.ok) {
    throw new Error(`API health check failed (${response.status}).`)
  }
}
