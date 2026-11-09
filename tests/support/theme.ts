import type { Page } from '@playwright/test';

// Switches the theme and waits for colour transitions to settle, so contrast checks read final colours.
export async function setTheme(page: Page, theme: 'dark' | 'light'): Promise<void> {
  await page.evaluate(async (t) => {
    document.documentElement.setAttribute('data-theme', t);
    const transitions = document.getAnimations().filter((a) => a instanceof CSSTransition);
    await Promise.all(transitions.map((a) => a.finished.catch(() => undefined)));
  }, theme);
}
