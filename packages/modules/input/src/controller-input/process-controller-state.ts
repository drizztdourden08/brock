/* @layer renderer-shell @kind logic */
import { applyTriggerCalibration } from '../calibration/apply-trigger-calibration';
import { useCalibrationStore } from '../renderer/useCalibrationStore';
import { SDL_AXIS } from '../sdl/sdl-buttons.constants';
import { itemAt } from '../checked-access';
import type { ControllerInputState } from '../runtime/controller-input-store.type';
import type { ControllerStateHost } from '../runtime/process-controller-state.type';

const markConnected = (host: ControllerStateHost, deviceKey: string): void => {
  if (host.connectedDeviceKeys.has(deviceKey)) return;
  host.connectedDeviceKeys.add(deviceKey);
  host.connected = true;
  host.log(`Connected: ${deviceKey}`);
};

const processControllerState = (host: ControllerStateHost, deviceKey: string, buttons: boolean[], axes: number[]): void => {
  const { triggers } = useCalibrationStore.getState();
  const resolvedAxes = [...axes];
  for (let i: number = SDL_AXIS.LEFT_TRIGGER; i < resolvedAxes.length; i++) {
    const triggerCal = triggers[`${deviceKey}:${i}`];
    if (triggerCal) resolvedAxes[i] = applyTriggerCalibration(itemAt(resolvedAxes, i), triggerCal);
  }

  markConnected(host, deviceKey);

  const state: ControllerInputState = {
    deviceKey,
    buttons,
    axes: resolvedAxes,
    timestamp: performance.now(),
  };
  host.states.set(deviceKey, state);
  for (const cb of host.listeners) cb(state);
};

export { processControllerState };
