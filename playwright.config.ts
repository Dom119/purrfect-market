import { defineConfig } from '@playwright/test';

const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);

export default defineConfig({
  testMatch: 'smoke.test.ts',
  outputDir: `test-results/${timestamp}`,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'on',
    video: 'off',
  },
  workers: 1,
  timeout: 15000,
});
