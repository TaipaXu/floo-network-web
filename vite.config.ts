import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/web',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        vuetify(),
        AutoImport({
            imports: ['vue'],
            dts: resolve('src/@types', 'auto-imports.d.ts')
        }),
        Components({
            include: [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.[jt]sx$/],
            dirs: ['src/widgets'],
            extensions: ['vue'],
            dts: resolve('src/@types', 'components.d.ts')
        })
    ],
    server: {
        port: 5000
    },
    build: {
        outDir: 'web'
    }
});
