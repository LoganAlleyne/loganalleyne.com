import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Runs against the production build that the prod web server just produced.
const dist = join(process.cwd(), 'dist');
const drafts = readdirSync('src/content/work')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^draft:\s*true\s*$/m.test(readFileSync(join('src/content/work', f), 'utf8')))
  .map((f) => f.replace(/\.md$/, ''));

test('draft case studies are not built', () => {
  expect(drafts.length).toBeGreaterThan(0);
  for (const slug of drafts) {
    expect(existsSync(join(dist, 'work', slug))).toBe(false);
  }
});

test('draft case studies are not in the sitemap', () => {
  const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  for (const slug of drafts) expect(sitemap).not.toContain(`/work/${slug}`);
});

test('home hides the work section and nav link when everything is a draft', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'work' })).toHaveCount(0);
});

test('a draft case study URL returns 404 in production', async ({ request }) => {
  for (const slug of drafts) {
    const res = await request.get(`/work/${slug}/`);
    expect(res.status()).toBe(404);
  }
});
