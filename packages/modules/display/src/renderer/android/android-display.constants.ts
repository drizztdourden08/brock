/* @layer renderer-shell @kind constants */
import type { WindowModeState } from '../../display.type';

const DISPLAY_PLUGIN = 'BrockDisplay';
const DISPLAY_CHANGED_EVENT = 'changed';
const ANDROID_MONITOR_ID = 'android';
const ANDROID_MONITOR_LABEL = 'This screen';
const NO_SYNCED_RATE = 'This display offers no refresh rate that is a multiple of 60.';

const ANDROID_WINDOW_MODE: WindowModeState = { mode: 'fullscreen', monitorId: null, lastError: '' };

export {
  DISPLAY_PLUGIN, DISPLAY_CHANGED_EVENT, ANDROID_MONITOR_ID, ANDROID_MONITOR_LABEL, NO_SYNCED_RATE, ANDROID_WINDOW_MODE,
};
