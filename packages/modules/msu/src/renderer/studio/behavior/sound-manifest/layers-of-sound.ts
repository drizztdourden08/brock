/* @layer renderer-shell @kind logic */
import type { MsuLayer, MsuPackManifest } from '../../../../types';
import { soundDefsOfChannel } from './sound-defs-of-channel';

const layersOfSound = (
  manifest: MsuPackManifest, channel: string, soundId: number,
): MsuLayer[] =>
  soundDefsOfChannel(manifest, channel).find((sound) => sound.soundId === soundId)?.layers ?? [];

export { layersOfSound };
