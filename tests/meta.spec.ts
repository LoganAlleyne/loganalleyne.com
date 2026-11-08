import { test, expect } from '@playwright/test';

test('unknown URLs get the custom 404 with a way home', async ({ page }) => {
  const res = await page.goto('/no-such-page/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/not found/i);
  await page.getByRole('link', { name: /back to home/i }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('home has canonical, description and social metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://loganalleyne.com/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://loganalleyne.com/og.png');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
});

test('static assets referenced by metadata exist', async ({ request }) => {
  for (const path of ['/og.png', '/favicon.svg', '/robots.txt', '/sitemap-index.xml']) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
});

test('robots.txt points at the sitemap', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text();
  expect(body).toContain('Sitemap: https://loganalleyne.com/sitemap-index.xml');
});

test('404 page is not in the sitemap', async ({ request }) => {
  const body = await (await request.get('/sitemap-0.xml')).text();
  expect(body).not.toContain('404');
});
