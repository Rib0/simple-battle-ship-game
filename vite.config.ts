import { defineConfig, splitVendorChunkPlugin } from 'vite';
import path from 'path';

import preact from '@preact/preset-vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  server: {
    port: 8080,
    open: true
  },
  plugins: [
    preact(),
    splitVendorChunkPlugin(), 
    checker({
      typescript: true, 
      eslint: {
        lintCommand: "eslint --ext .ts,.tsx src/"
      } 
    })
  ],
})
