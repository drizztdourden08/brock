/* @layer electron-main @kind constants */
const SPLASH_CHANNELS = {
  progress: 'splash:progress',
  failure: 'splash:failure',
  retry: 'splash:retry',
  quit: 'splash:quit',
  openLogs: 'splash:openLogs',
} as const;

const SPLASH_GLOBAL = 'brockSplash';

export { SPLASH_CHANNELS, SPLASH_GLOBAL };
