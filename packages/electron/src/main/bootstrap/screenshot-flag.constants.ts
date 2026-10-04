/* @layer electron-main @kind constants */
const SCREENSHOT_WATCHDOG_MS = 20_000;
const SPLASH_SCREENSHOT_FLAG = '--screenshot-splash';
const SPLASH_CAPTURE_DELAY_MS = 150;
const SPLASH_CLOSED_MESSAGE = 'the splash window closed before the capture';

export { SCREENSHOT_WATCHDOG_MS, SPLASH_CAPTURE_DELAY_MS, SPLASH_CLOSED_MESSAGE, SPLASH_SCREENSHOT_FLAG };
