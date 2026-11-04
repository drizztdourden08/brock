/* @layer core @kind logic */
import type { MsuPackManifest } from '../../types';
import type { SoundProgram } from '../channel';

const soundPrograms = (manifest: MsuPackManifest, channel: string): SoundProgram[] =>
  (manifest.sounds?.[channel] ?? []).map((sound) => ({
    id: sound.soundId, layers: sound.layers, group: sound.syncGroup,
  }));

export { soundPrograms };
