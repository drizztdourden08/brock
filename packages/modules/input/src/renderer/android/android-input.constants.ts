/* @layer renderer-shell @kind constants */
import type { InputCaptureApi } from '../../input-api.type';
import type { InputStatus } from '../../device.type';

const INPUT_PLUGIN = 'BrockInput';
const CONTROLLER_EVENT = 'controllerEvent';
const STORAGE_PREFIX = 'brock-input:';

const INPUT_OFF: InputStatus = { available: false, sdlVersion: null };

const NO_CAPTURE_MESSAGE = 'Raw and joystick capture need the desktop app.';

const noUnsubscribe = (): (() => void) => () => {};

const UNSUPPORTED_CAPTURE: InputCaptureApi = {
  startRaw: () => Promise.resolve({ ok: false, reason: 'error', message: NO_CAPTURE_MESSAGE }),
  stopRaw: () => Promise.resolve(),
  startJoystick: () => Promise.resolve(false),
  stopJoystick: () => Promise.resolve(),
  listJoysticks: () => Promise.resolve([]),
  releaseHold: () => Promise.resolve(false),
  restoreHold: () => Promise.resolve(false),
  onRaw: noUnsubscribe,
  onJoystick: noUnsubscribe,
  onHoldChanged: noUnsubscribe,
};

export { INPUT_PLUGIN, CONTROLLER_EVENT, STORAGE_PREFIX, INPUT_OFF, UNSUPPORTED_CAPTURE };
