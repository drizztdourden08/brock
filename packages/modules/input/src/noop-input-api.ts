/* @layer core @kind logic */
import type { InputApi, InputCalibrationApi, InputCaptureApi, InputMappingApi } from './input-api.type';
import { OFF_MESSAGE } from './input.constants';

const unsubscribe = (): void => undefined;
const listen = (): (() => void) => unsubscribe;
const none = <T>(): Promise<T[]> => Promise.resolve([]);
const no = (): Promise<boolean> => Promise.resolve(false);
const done = (): Promise<void> => Promise.resolve();

const mapping: InputMappingApi = { add: no, forGuid: () => Promise.resolve(null) };

const calibration: InputCalibrationApi = {
  readSticks: () => Promise.resolve({}),
  writeStick: done,
  readTriggers: () => Promise.resolve({}),
  writeTrigger: done,
};

const capture: InputCaptureApi = {
  startRaw: () => Promise.resolve({ ok: false, reason: 'error', message: OFF_MESSAGE }),
  stopRaw: done,
  startJoystick: no,
  stopJoystick: done,
  listJoysticks: none,
  releaseHold: no,
  restoreHold: no,
  onRaw: listen,
  onJoystick: listen,
  onHoldChanged: listen,
};

const api: InputApi = {
  status: () => Promise.resolve({ available: false, sdlVersion: null }),
  list: none,
  refresh: none,
  listHid: none,
  rescan: done,
  rumble: no,
  vibratePattern: () => Promise.resolve({ ok: false, error: OFF_MESSAGE }),
  onAdded: listen,
  onRemoved: listen,
  onState: listen,
  onDevices: listen,
  mapping: Object.freeze(mapping),
  calibration: Object.freeze(calibration),
  capture: Object.freeze(capture),
};

const noopInputApi: InputApi = Object.freeze(api);

export { noopInputApi };
