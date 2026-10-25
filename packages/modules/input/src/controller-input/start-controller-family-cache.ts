/* @layer renderer-shell @kind logic */
import { seedPerDeviceCache } from './seed-device-cache';
import { rememberControllerSdlType } from '../runtime/controller-family-cache/remember-controller-sdl-type';

const recording: { unsubscribe: (() => void) | null } = { unsubscribe: null };

const keepRecording = (): void => undefined;

const startControllerFamilyCache = (): (() => void) => {
  if (recording.unsubscribe) return keepRecording;
  recording.unsubscribe = seedPerDeviceCache((fields) => {
    if (!fields.sdlType) return;
    rememberControllerSdlType({ vendorId: fields.vendorId, productId: fields.productId, sdlType: fields.sdlType });
  });
  return keepRecording;
};

export { startControllerFamilyCache };
