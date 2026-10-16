/* @layer renderer-shell @kind logic */
import type { VolumeBinding, VolumeLevel } from './volume.type';

const linked: { binding: VolumeBinding | null } = { binding: null };

const volumeLink = {
  current: (): VolumeBinding | null => linked.binding,
  write: (next: VolumeLevel, local: (next: VolumeLevel) => void): void => {
    if (linked.binding) linked.binding.set(next);
    else local(next);
  },
  attach: (binding: VolumeBinding): void => { linked.binding = binding; },
  detach: (binding: VolumeBinding): void => {
    if (linked.binding === binding) linked.binding = null;
  },
};

export { volumeLink };
