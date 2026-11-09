// Renders scripts/banner/banner.html to brand/linkedin-banner.png at twice LinkedIn's 1584×396, for sharpness.
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(resolve(here, 'banner.html')).href;
const target = resolve(here, '../../brand/linkedin-banner.png');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 2 });
  await page.goto(source, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: target });
  console.log(`Wrote ${target}`);
} finally {
  await browser.close();
}
