/* @layer renderer-shell @kind logic */
import { saneVolume } from './sane-volume';
import { useVolumeStore } from './useVolumeStore';
import { volumeLink } from './volume-link';
import type { VolumeBinding } from './volume.type';

const pull = (binding: VolumeBinding): void => {
  const next = saneVolume(binding.get());
  const { value, muted } = useVolumeStore.getState();
  if (next.value !== value || next.muted !== muted) useVolumeStore.setState(next);
};

const bindVolume = (binding: VolumeBinding): (() => void) => {
  volumeLink.attach(binding);
  pull(binding);
  const off = binding.subscribe(() => pull(binding));
  return () => {
    off();
    volumeLink.detach(binding);
  };
};

export { bindVolume };
