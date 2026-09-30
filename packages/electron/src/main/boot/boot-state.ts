/* @layer electron-main @kind logic */
import type { BootState } from './boot-state.type';
import { WATCHDOG_MS } from './reveal.constants';

const bootState: BootState = {
  splash: null,
  app: null,
  headless: false,
  main: null,
  renderer: null,
  lastSide: 'main',
  shownFraction: 0,
  mainDone: false,
  rendererReady: false,
  failure: null,
  revealing: false,
  revealed: false,
  present: null,
  watchdog: null,
  watchdogMs: WATCHDOG_MS,
  holds: [],
  timeline: { bootDoneAt: null, appShownAt: null, splashClosedAt: null, splashOpenAtCapture: null },
};

export { bootState };
