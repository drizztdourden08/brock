/* @layer tooling-scripts @kind constants */
const HEADLESS_ARGS = Object.freeze(['--no-focus', '--muted']);
const MAIN_ENTRY = 'dist/electron/main.js';
const FIRST_WINDOW_TIMEOUT_MS = 60000;
const APP_WINDOW_POLL_MS = 100;
const OUTPUT_TAIL = 4000;
const DRIVER_PACKAGES = Object.freeze(['playwright-core', 'playwright', '@playwright/test']);
const SPLASH_PAGE = /\/splash\.html$/;
const WIDGET_QUERY_KEY = 'widget';
const LAYOUT_GLOBAL = '__brockWidgetLayout';

export { APP_WINDOW_POLL_MS, DRIVER_PACKAGES, FIRST_WINDOW_TIMEOUT_MS, HEADLESS_ARGS, LAYOUT_GLOBAL, MAIN_ENTRY, OUTPUT_TAIL, SPLASH_PAGE, WIDGET_QUERY_KEY };
