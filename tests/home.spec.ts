import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('introduces Logan', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Logan Alleyne');
  await expect(page.getByText('Full-Stack Software Engineer', { exact: false }).first()).toBeVisible();
  await expect(page.getByText(/London or remote/i).first()).toBeVisible();
});

test('shows headline facts about Logan, not the employer', async ({ page }) => {
  const facts = page.getByRole('list', { name: /headline facts/i });
  await expect(facts.locator('li')).toHaveCount(5);
  for (const value of ['6 yrs', 'TDD', 'WCAG', '93%', '31']) {
    await expect(facts.getByText(value, { exact: true })).toBeVisible();
  }
  await expect(facts).not.toContainText(/£|users|engineers|applications/);
});

test('labels each role with the Unix timestamp of its start month', async ({ page }) => {
  const stamps = page.locator('#experience article [data-epoch]');
  await expect(stamps).toHaveText(['1748736000', '1612137600', '1593561600', '1567296000']);
  await expect(stamps.first()).toHaveAttribute('title', /1 June 2025/);
});

test('lists roles in reverse chronological order', async ({ page }) => {
  const roles = page.locator('#experience article h3');
  await expect(roles).toHaveText([/Aspen Pumps/, /BrandStencil/, /ReedPop/, /The Edit_/]);
});

test('writes FrameTech as one word with capitals', async ({ page }) => {
  const text = await page.locator('body').innerText();
  expect(text).toContain('FrameTech');
  expect(text).not.toMatch(/Frame Tech|Frametech|frametech/);
});

test('contact links point to the right places', async ({ page }) => {
  const contact = page.locator('#contact');
  await expect(contact.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:hello@loganalleyne.com');
  await expect(contact.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/logan-alleyne-827797139/');
  await expect(contact.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/LoganAlleyne');
});

test('CV download is served', async ({ page, request }) => {
  const link = page.getByRole('link', { name: /download cv/i }).first();
  await expect(link).toHaveAttribute('href', '/logan-alleyne-cv.pdf');
  const res = await request.get('/logan-alleyne-cv.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

for (const theme of ['dark', 'light'] as const) {
  test(`has no accessibility violations in ${theme} theme`, async ({ page }) => {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}

test('content is visible with reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/');
  for (const id of ['experience', 'skills', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
    const opacity = await page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  }
  await ctx.close();
});

test('content becomes visible after scrolling with motion allowed', async ({ page }) => {
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact')).toHaveCSS('opacity', '1', { timeout: 3000 });
});
