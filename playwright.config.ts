import { defineConfig, devices } from '@playwright/test';

// Two servers: the production build (what ships) and the dev server (where
// draft case studies are visible).
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { ...devices['Desktop Chrome'] },
  projects: [
    { name: 'prod', testIgnore: /\.dev\.spec\.ts/, use: { baseURL: 'http://localhost:4321' } },
    { name: 'dev', testMatch: /\.dev\.spec\.ts/, use: { baseURL: 'http://localhost:4322' } },
  ],
  webServer: [
    { command: 'npm run build && npx astro preview --port 4321', port: 4321, reuseExistingServer: !process.env.CI, timeout: 120_000 },
    { command: 'npx astro dev --port 4322', port: 4322, reuseExistingServer: !process.env.CI, timeout: 120_000 },
  ],
});
