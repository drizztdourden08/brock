/* @layer renderer-shell @kind logic */
import { seedPerDeviceCache } from './seed-device-cache';
import { rememberControllerName } from '../runtime/controller-name-cache/remember-controller-name';

const recording: { unsubscribe: (() => void) | null } = { unsubscribe: null };

const keepRecording = (): void => undefined;

const startControllerNameCache = (): (() => void) => {
  if (recording.unsubscribe) return keepRecording;
  recording.unsubscribe = seedPerDeviceCache((fields) => {
    if (!fields.name) return;
    rememberControllerName({
      deviceKey: fields.deviceKey,
      vendorId: fields.vendorId,
      productId: fields.productId,
      name: fields.name,
    });
  });
  return keepRecording;
};

export { startControllerNameCache };
