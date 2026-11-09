import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Runs against the production build that the prod web server just produced.
const dist = join(process.cwd(), 'dist');
const caseStudies = readdirSync('src/content/work')
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ slug: f.replace(/\.md$/, ''), draft: /^draft:\s*true\s*$/m.test(readFileSync(join('src/content/work', f), 'utf8')) }));
const published = caseStudies.filter((c) => !c.draft).map((c) => c.slug);
const drafts = caseStudies.filter((c) => c.draft).map((c) => c.slug);

test('all six case studies are published', () => {
  expect(published).toHaveLength(6);
});

test('published case studies are built and in the sitemap', () => {
  const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  for (const slug of published) {
    expect(existsSync(join(dist, 'work', slug, 'index.html')), slug).toBe(true);
    expect(sitemap).toContain(`/work/${slug}/`);
  }
});

test('home shows the work section and nav link', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work li')).toHaveCount(published.length);
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'work' })).toBeVisible();
});

test('published case studies carry no draft banner', async ({ page }) => {
  for (const slug of published) {
    await page.goto(`/work/${slug}/`);
    await expect(page.getByText(/draft: not published/i)).toHaveCount(0);
  }
});

test('published case studies pass WCAG 2.2 AA checks in both themes', async ({ page }) => {
  for (const slug of published) {
    for (const theme of ['dark', 'light']) {
      await page.goto(`/work/${slug}/`);
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`), `${slug} (${theme})`).toEqual([]);
    }
  }
});

test('any draft case study stays out of the build and the sitemap', async ({ request }) => {
  const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  for (const slug of drafts) {
    expect(existsSync(join(dist, 'work', slug))).toBe(false);
    expect(sitemap).not.toContain(`/work/${slug}`);
    expect((await request.get(`/work/${slug}/`)).status()).toBe(404);
  }
});

test('the private email address is not published', () => {
  const textFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = join(dir, e.name);
      if (e.isDirectory()) return textFiles(p);
      return /\.(html|xml|txt|js|css|json)$/.test(e.name) ? [p] : [];
    });
  for (const file of [...textFiles(dist), 'scripts/cv/cv.html']) {
    expect(readFileSync(file, 'utf8'), file).not.toContain('outlook.com');
  }
});
