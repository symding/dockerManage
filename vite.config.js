import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    runtimeCompiler: true,
    plugins: [vue()],
    server: {
        proxy: {
            '/docker': {
                target: 'http://177.177.1.2:8081', // 实际请求地址
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://127.0.0.1:8999',
                changeOrigin: true,
            }
        },
    }
})
