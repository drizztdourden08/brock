/* @layer tooling-scripts @kind logic */
import { FIRST_WINDOW_TIMEOUT_MS, LAYOUT_GLOBAL } from './testing.constants.mjs';

/**
 * @param {any} page the app window's Playwright Page
 * @param {{ timeoutMs?: number }} [options]
 * @returns {Promise<{ layout: object, docked: string[], floating: string[], popped: string[], main: object | null, rects: Record<string, object> }>}
 */
const readDockLayout = async (page, { timeoutMs = FIRST_WINDOW_TIMEOUT_MS } = {}) => {
  try {
    await page.waitForFunction((key) => typeof globalThis[key] === 'function', LAYOUT_GLOBAL, { timeout: timeoutMs });
  } catch (error) {
    throw new Error('The page has no widget layout reader: readDockLayout needs the app window of an automation launch (launchAppForTest passes --no-focus) with the widget host drawn.', { cause: error });
  }
  return page.evaluate((key) => globalThis[key](), LAYOUT_GLOBAL);
};

export { readDockLayout };
