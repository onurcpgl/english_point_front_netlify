import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr'
export default defineConfig({
    plugins: [

        laravel({
            input: ['resources/react-app/src/main.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: 'manifest.json', // <- BURAYI DEĞİŞTİR
    },
    cacheDir: 'node_modules/.vite',
    base: '/build/',
});
