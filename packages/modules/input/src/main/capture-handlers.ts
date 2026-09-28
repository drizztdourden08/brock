/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { RawCaptureStartResult } from '../capture.type';
import type { InputMain } from './input-main.type';
import type { Sdl3RawCaptureResult } from './sdl3.type';

const toStartResult = (result: Sdl3RawCaptureResult): RawCaptureStartResult =>
  result.success ? { ok: true } : { ok: false, reason: result.reason, ...(result.message ? { message: result.message } : {}) };

const registerCaptureHandlers = ({ handle }: Pick<MainContext, 'handle'>, { runtime }: InputMain): void => {
  handle('input:capture:startRaw', (_event, vendorId, productId) => toStartResult(runtime().addon.startRawCapture(vendorId, productId)));
  handle('input:capture:stopRaw', () => { runtime().addon.stopRawCapture(); });
  handle('input:capture:startJoystick', (_event, joystickId) => runtime().addon.startJoystickCapture(joystickId));
  handle('input:capture:stopJoystick', () => { runtime().addon.stopJoystickCapture(); });
  handle('input:capture:listJoysticks', () => runtime().addon.listJoysticks());
  handle('input:capture:releaseHold', () => runtime().addon.releaseGamepads());
  handle('input:capture:restoreHold', () => runtime().addon.restoreGamepads());
};

export { registerCaptureHandlers };
