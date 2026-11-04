/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';
import { claimableIds } from './claimable-ids';

const manifestSoundIds = (manifest: MsuPackManifest, channel: string, idCount: number): number[] =>
  claimableIds((manifest.sounds?.[channel] ?? [])
    .filter((sound) => sound.layers.length > 0)
    .map((sound) => sound.soundId), idCount);

export { manifestSoundIds };
