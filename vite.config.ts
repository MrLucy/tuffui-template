import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'MOCK_')

  return {
    server: { port: 5180 },
    plugins: [
      react(),
      tailwindcss(),
      mockDevServerPlugin({
        enabled:
          command === 'serve' && !isPreview && env.MOCK_ENABLED === 'true',
        prefix: ['/api'],
      }),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  }
})
