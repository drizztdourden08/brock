/* @layer renderer-shell @kind logic */
import { clampVolume } from './clamp-volume';
import { patchAt } from './patch-at';
import { readPath } from './read-path';
import { FULL_VOLUME } from './volume.constants';
import type { VolumeBindingFactory, VolumeSettingsKeys } from './volume.type';

const volumeFromSettings = (keys: VolumeSettingsKeys): VolumeBindingFactory => (store) => {
  const scale = keys.max !== undefined && keys.max > 0 ? keys.max : 1;
  const settings = (): object => store.getState().settings;
  return {
    get: () => {
      const raw = readPath(settings(), keys.value);
      return { value: typeof raw === 'number' ? clampVolume(raw / scale) : FULL_VOLUME.value, muted: readPath(settings(), keys.muted) === true };
    },
    set: (next) => store.getState().patch(patchAt(settings(), [[keys.value, next.value * scale], [keys.muted, next.muted]])),
    subscribe: (listener) => store.subscribe((state, prev) => {
      if (state.settings !== prev.settings) listener();
    }),
  };
};

export { volumeFromSettings };
