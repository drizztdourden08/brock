/* @layer renderer-shell @kind logic */
import { useCalibrationStore } from '../renderer/useCalibrationStore';
import { calibrateAxes } from './calibrate-axes';
import type { ControllerInputState } from '../runtime/controller-input-store.type';
import type { ControllerStateHost } from '../runtime/process-controller-state.type';

const markConnected = (host: ControllerStateHost, deviceKey: string): void => {
  if (host.connectedDeviceKeys.has(deviceKey)) return;
  host.connectedDeviceKeys.add(deviceKey);
  host.connected = true;
  host.log(`Connected: ${deviceKey}`);
};

const processControllerState = (host: ControllerStateHost, deviceKey: string, buttons: boolean[], axes: number[]): void => {
  const { sticks, triggers } = useCalibrationStore.getState();
  const resolvedAxes = calibrateAxes(deviceKey, axes, { sticks, triggers });

  markConnected(host, deviceKey);

  const state: ControllerInputState = {
    deviceKey,
    buttons,
    axes: resolvedAxes,
    rawSticks: [axes[0] ?? 0, axes[1] ?? 0, axes[2] ?? 0, axes[3] ?? 0],
    timestamp: performance.now(),
  };
  host.states.set(deviceKey, state);
  for (const cb of host.listeners) cb(state);
};

export { processControllerState };
