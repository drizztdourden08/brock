/* @layer electron-main @kind constants */
import type { Sdl3Input } from './sdl3.type';

const ADDON_DIR = 'sdl3';
const ADDON_FILE = 'sdl3_input.node';

const UNAVAILABLE_ADDON: Sdl3Input = {
  start: () => undefined,
  stop: () => undefined,
  rumble: () => false,
  addMapping: () => false,
  addMappingsFromFile: () => 0,
  enumerateHid: () => [],
  rescan: () => undefined,
  releaseGamepads: () => false,
  restoreGamepads: () => false,
  version: () => null,
  startRawCapture: () => ({ success: false, reason: 'error', message: 'The SDL3 addon is not loaded.' }),
  stopRawCapture: () => undefined,
  startJoystickCapture: () => false,
  stopJoystickCapture: () => undefined,
  listJoysticks: () => [],
  mappingForGuid: () => null,
};

export { ADDON_DIR, ADDON_FILE, UNAVAILABLE_ADDON };
