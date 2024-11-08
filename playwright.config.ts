import { defineConfig } from '@playwright/test';

export default defineConfig({
    timeout: 20000,
    retries: 0,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        baseURL: 'https://www.saucedemo.com/',
    },
    reporter: [
        ['html', { outputFolder: 'html-report', open: 'always' }]
    ],
});
