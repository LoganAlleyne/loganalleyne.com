// Renders scripts/cv/cv.html to public/logan-alleyne-cv.pdf with Playwright's Chromium.
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(resolve(here, 'cv.html')).href;
const target = resolve(here, '../../public/logan-alleyne-cv.pdf');

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(source, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: target, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log(`Wrote ${target}`);
} finally {
  await browser.close();
}
