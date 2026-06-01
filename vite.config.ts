import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 如果你用的是React，保留这行
// import vue from '@vitejs/plugin-vue' // 如果你用的是Vue，用这行替换上面的

export default defineConfig({
  // Netlify部署在根域名，base设为'/'即可
  base: '/',

  plugins: [
    react() // Vue的话改成 vue()
  ],

  build: {
    // 去掉大文件警告
    chunkSizeWarningLimit: 1000,
    // 适配Netlify构建
    outDir: 'dist',
    assetsDir: 'assets'
  }
})