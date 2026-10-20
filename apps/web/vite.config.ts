import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('../../', import.meta.url)), '')
  const apiHost = env.API_HOST || '127.0.0.1'
  const apiPort = env.API_PORT || '3000'

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Caliip',
          short_name: 'Caliip',
          description: 'Local-first calorie tracking.',
          theme_color: '#276749',
          background_color: '#fafafa',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,ico,png}'],
          navigateFallbackDenylist: [/^\/api(?:\/|$)/],
        },
      }),
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: { '/api': `http://${apiHost}:${apiPort}` },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
      restoreMocks: true,
      unstubGlobals: true,
    },
  }
})
