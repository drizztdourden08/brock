/* @layer tooling-scripts @kind constants */
const HEADLESS_ARGS = Object.freeze(['--no-focus', '--muted']);
const MAIN_ENTRY = 'dist/electron/main.js';
const FIRST_WINDOW_TIMEOUT_MS = 60000;
const OUTPUT_TAIL = 4000;
const DRIVER_PACKAGES = Object.freeze(['playwright-core', 'playwright', '@playwright/test']);

export { HEADLESS_ARGS, MAIN_ENTRY, FIRST_WINDOW_TIMEOUT_MS, OUTPUT_TAIL, DRIVER_PACKAGES };
