/* @layer renderer-shell @kind logic */
import { FULL_VOLUME } from './volume.constants';

const clampVolume = (value: number): number => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : FULL_VOLUME.value);

export { clampVolume };
