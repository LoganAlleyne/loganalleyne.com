import { test, expect } from '@playwright/test';

test('renders dark by default with no stored preference', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('stays dark under a light system preference when nothing is stored', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/');
  // Dark-first: the site stays dark unless the visitor chooses otherwise.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await ctx.close();
});

test('toggle switches to light and persists across reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /switch to light theme/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: /switch to dark theme/i })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('toggle still works when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /switch to light theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
