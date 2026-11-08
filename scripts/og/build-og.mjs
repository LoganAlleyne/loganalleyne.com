// Renders scripts/og/og.html to public/og.png (1200×630) with Playwright's Chromium.
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(resolve(here, 'og.html')).href;
const target = resolve(here, '../../public/og.png');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(source, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: target });
  console.log(`Wrote ${target}`);
} finally {
  await browser.close();
}
