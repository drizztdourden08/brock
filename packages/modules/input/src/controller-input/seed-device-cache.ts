/* @layer renderer-shell @kind logic */
import { inputApi } from '../renderer/input-api';
import type { DeviceSnapshotFields } from '../runtime/seed-device-cache.type';

const seedPerDeviceCache = (remember: (fields: DeviceSnapshotFields) => void): (() => void) => {
  const api = inputApi();
  api.list().then((entries) => entries.forEach(remember)).catch(() => undefined);
  const unsubSnapshot = api.onDevices((entries) => entries.forEach(remember));
  const unsubAdded = api.onAdded(remember);
  return () => {
    unsubSnapshot();
    unsubAdded();
  };
};

export { seedPerDeviceCache };
