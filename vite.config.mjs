import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import i18n from 'laravel-react-i18n/vite';
import fs from 'fs';

const httpsKeyPath = './certs/ukimua-dev.com-key.pem';
const httpsCertPath = './certs/ukimua-dev.com.pem';
const useHttps = fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath);

export default defineConfig({
    plugins: [
        laravel(['resources/js/app.tsx', 'resources/css/app.css']),
        react(),
        i18n(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: {
            origin: '*',
        },
        ...(useHttps ? {
            https: {
                key: fs.readFileSync(httpsKeyPath),
                cert: fs.readFileSync(httpsCertPath),
            },
        } : {}),
        hmr: {
            host: 'ukimua-dev.com',
        },
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
});
