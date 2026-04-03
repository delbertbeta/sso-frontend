import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { getAppConfig } from './config/app';

const appConfig = getAppConfig();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: appConfig.port,
    host: '0.0.0.0',
    hmr: {
      port: appConfig.hmrPort,
      clientPort: appConfig.clientPort,
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
        }),
      ],
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      $router: resolve(__dirname, './src/router'),
      $api: resolve(__dirname, './src/api'),
      $pages: resolve(__dirname, './src/pages'),
      $components: resolve(__dirname, './src/components'),
      $assets: resolve(__dirname, './src/assets'),
      $utils: resolve(__dirname, './src/utils'),
      $layouts: resolve(__dirname, './src/layouts'),
      $typings: resolve(__dirname, './src/typings'),
      $store: resolve(__dirname, './src/store'),
      $constants: resolve(__dirname, './src/constants'),
    },
  },
  define: {
    API_END_POINT: `'${appConfig.apiEndPoint}'`,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    globals: true,
  },
});
