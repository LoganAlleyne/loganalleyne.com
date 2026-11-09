import { test, expect } from '@playwright/test';

const slugs = [
  'frametech-suite',
  'component-library', 'storage-gateway', 'domain-engines', 'single-sign-on', 'paid-api-safety',
];

test('shows work cards in order', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work li h3');
  await expect(cards).toHaveText([
    /FrameTech suite/i,
    /component library/i,
    /storage gateway/i,
    /calculation and pricing engines/i,
    /single sign-on/i,
    /paid APIs/i,
  ]);
});

for (const slug of slugs) {
  test(`case study ${slug} renders with its sections and a way back`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const h of ['The problem', 'Constraints', 'Outcome']) {
      await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
    }
    await expect(page.getByRole('heading', { level: 2, name: /^What (I|we) built$/ })).toBeVisible();
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/(#work)?$/);
  });

  test(`case study ${slug} shows background only when it isn't the suite overview`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    const background = page.getByLabel('Background');
    if (slug === 'frametech-suite') {
      await expect(background).toHaveCount(0);
      return;
    }
    await expect(background).toContainText('Aspen Pumps');
    await background.getByRole('link', { name: /suite overview/i }).click();
    await expect(page).toHaveURL(/\/work\/frametech-suite\/$/);
  });

  test(`case study ${slug} keeps FrameTech spelling`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/Frame Tech|Frametech|frametech/);
  });
}

test('links between case studies all resolve', async ({ page, request }) => {
  await page.goto('/work/frametech-suite/');
  const hrefs = await page.locator('.prose-plain a[href^="/work/"]').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href') as string),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});
