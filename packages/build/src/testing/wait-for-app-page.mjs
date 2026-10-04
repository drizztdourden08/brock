/* @layer tooling-scripts @kind logic */
import { APP_WINDOW_POLL_MS } from './testing.constants.mjs';
import { pageKindOf } from './page-kind.mjs';

const pause = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const kindsOf = (app) => app.windows().map((page) => ({ page, kind: pageKindOf(page.url()) }));

const stallReason = (windows) => {
  if (windows.some((entry) => entry.kind === 'splash')) return 'the splash is still open, so the boot never finished (it stalled or stopped on its error screen)';
  if (windows.length === 0) return 'no window opened';
  return 'no window loaded the renderer index';
};

/**
 * @param {{ windows: () => { url: () => string }[] }} app Playwright's ElectronApplication
 * @param {number} timeout ms
 * @returns {Promise<any>} the app window's Page
 */
const waitForAppPage = async (app, timeout) => {
  const deadline = Date.now() + timeout;
  for (;;) {
    const windows = kindsOf(app);
    const found = windows.find((entry) => entry.kind === 'app');
    if (found && !windows.some((entry) => entry.kind === 'splash')) return found.page;
    if (Date.now() >= deadline) throw new Error(`The app window was not ready after ${timeout} ms: ${stallReason(windows)}.`);
    await pause(APP_WINDOW_POLL_MS);
  }
};

export { waitForAppPage };
