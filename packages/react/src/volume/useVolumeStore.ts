/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { clampVolume } from './clamp-volume';
import { FULL_VOLUME } from './volume.constants';
import { volumeLink } from './volume-link';
import type { VolumeLevel, VolumeState } from './volume.type';

const audible = { last: FULL_VOLUME.value };

const useVolumeStore = create<VolumeState>()((set, get) => {
  const write = (next: VolumeLevel): void => {
    if (next.value > 0) audible.last = next.value;
    volumeLink.write(next, (level) => set(level));
  };
  return {
    ...FULL_VOLUME,
    setValue: (given) => {
      const value = clampVolume(given);
      write({ value, muted: get().muted && value <= 0 });
    },
    setMuted: (muted) => write({ value: get().value, muted }),
    toggleMute: () => {
      const { value, muted } = get();
      write(value <= 0 ? { value: audible.last, muted: false } : { value, muted: !muted });
    },
  };
});

useVolumeStore.subscribe(({ value }) => {
  if (value > 0) audible.last = value;
});

export { useVolumeStore };
