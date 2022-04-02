import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
  ],
  resolve: {
    alias: {
      '$router': resolve(__dirname, './src/router'),
      '$api': resolve(__dirname, './src/api'),
      '$pages': resolve(__dirname, './src/pages'),
      '$components': resolve(__dirname, './src/components'),
      '$assets': resolve(__dirname, './src/assets'),
      '$utils': resolve(__dirname, './src/utils'),
      '$layouts': resolve(__dirname, './src/layouts'),
    },
  },
})
