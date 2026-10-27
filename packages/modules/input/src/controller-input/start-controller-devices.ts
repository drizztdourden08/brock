/* @layer renderer-shell @kind logic */
import { inputApi } from '../renderer/input-api';
import { useControllerDevicesStore } from '../renderer/useControllerDevicesStore';

const watching: { stop: (() => void) | null } = { stop: null };

const loadDevices = (): void => {
  void useControllerDevicesStore.getState().refresh();
};

const startControllerDevices = (): (() => void) => {
  if (watching.stop) return watching.stop;
  loadDevices();
  const unsubscribeHold = inputApi().capture.onHoldChanged((held) => {
    if (held) loadDevices();
  });
  watching.stop = () => {
    unsubscribeHold();
    watching.stop = null;
  };
  return watching.stop;
};

export { startControllerDevices };
