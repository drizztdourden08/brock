/* @layer renderer-shell @kind logic */
import { createCalibrationStore } from '../../calibration/calibration-store';
import { createHapticPlayer } from '../../haptics/haptic-player';
import type { InputApi } from '../../input-api.type';
import type { BrockInputPlugin } from './android-input.type';
import { STORAGE_PREFIX, UNSUPPORTED_CAPTURE } from './android-input.constants';
import { createAndroidControllers } from './create-android-controllers';
import { createLocalFileStore } from './create-local-file-store';
import { createMappingStore } from './create-mapping-store';

const createAndroidInputApi = (plugin: BrockInputPlugin): InputApi => {
  const files = createLocalFileStore(STORAGE_PREFIX);
  const mappings = createMappingStore(plugin, files);
  const controllers = createAndroidControllers(plugin, mappings);
  const { registry } = controllers;

  const rumble = async (deviceKey: string, low: number, high: number, durationMs: number): Promise<boolean> => {
    const device = registry.device(deviceKey);
    if (!device) return false;
    const { ok } = await plugin.rumble({ id: device.sdlId, low, high, durationMs }).catch(() => ({ ok: false }));
    return ok;
  };

  const haptics = createHapticPlayer((deviceKey, low, high, durationMs) => {
    if (!registry.device(deviceKey)?.hasRumble) return false;
    if (durationMs > 0) void rumble(deviceKey, low, high, durationMs);
    return true;
  });

  return {
    status: () => controllers.start(),
    list: async () => {
      await controllers.start();
      return registry.snapshot();
    },
    listHid: () => Promise.resolve([]),
    rescan: async () => {
      await controllers.start();
      controllers.devices.emit(registry.snapshot());
    },
    rumble,
    vibratePattern: (deviceKey, pattern, gapMs) => Promise.resolve(haptics.play(deviceKey, pattern, gapMs)),
    onAdded: controllers.added.on,
    onRemoved: controllers.removed.on,
    onState: (listener) => controllers.state.on(listener),
    onDevices: controllers.devices.on,
    mapping: {
      add: mappings.add,
      forGuid: async (guid) => (await plugin.mappingForGuid({ guid }).catch(() => ({ mapping: undefined }))).mapping ?? null,
    },
    calibration: createCalibrationStore(files),
    capture: UNSUPPORTED_CAPTURE,
  };
};

export { createAndroidInputApi };
