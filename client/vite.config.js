import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/music': 'http://localhost:3000',
        '/callback': 'http://localhost:3000',
        '/logout': 'http://localhost:3000'
  }
}
})
