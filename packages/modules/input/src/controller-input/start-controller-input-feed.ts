/* @layer renderer-shell @kind logic */
import { inputApi } from '../renderer/input-api';
import { controllerInputStore } from './controller-input-store';

const feeding: { stop: (() => void) | null } = { stop: null };

const startControllerInputFeed = (): (() => void) => {
  if (feeding.stop) return feeding.stop;
  const api = inputApi();
  const unsubscribers = [
    api.onState((deviceKey, buttons, axes) => {
      controllerInputStore.handleControllerState(deviceKey, buttons, axes);
    }),
    api.onRemoved((deviceKey) => {
      controllerInputStore.handleControllerRemoved(deviceKey);
    }),
    api.capture.onRaw((report) => {
      controllerInputStore.handleRawReport(report);
    }),
  ];
  feeding.stop = () => {
    for (const unsubscribe of unsubscribers) unsubscribe();
    feeding.stop = null;
  };
  return feeding.stop;
};

export { startControllerInputFeed };
