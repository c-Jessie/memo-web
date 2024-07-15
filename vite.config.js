import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
     devSourcemap: true // 是否开启 css 的 sourcemap
  }
})
