import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: "0.0.0.0",
    port: "5173",
    proxy: {
      '/api': {
        // target: 'http://devbox.ns-9mcqpenu.svc.cluster.local:3000',            // 服务器后端内网地址
        // target: 'https://localhost:3000',                                      // 后端的本地端口
        target: 'https://jfeejjlgtyra.sealosbja.site',                            // 服务器后端公网地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['vue']
  }
})
