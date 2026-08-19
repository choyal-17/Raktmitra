// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: process.env.VITE_BASE_PATH || '/',
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    proxy: {
      // proxy API requests
      '/api': {
        target: 'https://raktmitrabackend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      // proxy image uploads or static resources
      '/uploads': {
        target: 'https://raktmitrabackend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
