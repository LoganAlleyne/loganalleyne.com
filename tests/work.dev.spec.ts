import { test, expect } from '@playwright/test';

const slugs = ['service-trust', 'built-for-failure', 'configurator'];

test('dev shows work cards for drafts, in order', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work li h3');
  await expect(cards).toHaveText([/Trust between services/, /Built for failure/, /3D configurator/]);
});

for (const slug of slugs) {
  test(`case study ${slug} renders with a draft banner and a way back`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/draft: not published/i)).toBeVisible();
    for (const h of ['The problem', 'Constraints', 'What I built', 'Outcome']) {
      await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
    }
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/(#work)?$/);
  });

  test(`case study ${slug} keeps FrameTech spelling`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/Frame Tech|Frametech|frametech/);
  });
}
