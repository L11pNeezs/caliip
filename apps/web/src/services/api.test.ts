import { describe, expect, it, vi } from 'vitest'
import { checkApiHealth } from './api'

describe('development API connection', () => {
  it('uses the same-origin API path served by the Vite proxy', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetch)

    await expect(checkApiHealth()).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledWith('/api/health')
  })

  it('reports unsuccessful API responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))

    await expect(checkApiHealth()).rejects.toThrow('API health check failed (503).')
  })
})
