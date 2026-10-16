/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { clampVolume } from './clamp-volume';
import { FULL_VOLUME } from './volume.constants';
import type { VolumeLevel } from './volume.type';

const saneVolume = (stored: unknown): VolumeLevel => {
  if (!isRecord(stored)) return FULL_VOLUME;
  const value = typeof stored.value === 'number' ? clampVolume(stored.value) : FULL_VOLUME.value;
  return { value, muted: stored.muted === true };
};

export { saneVolume };
