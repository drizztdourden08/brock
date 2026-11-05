/* @layer renderer-shell @kind logic */
import type { MsuPackManifest } from '../../../../types';
import { soundDefsOfChannel } from './sound-defs-of-channel';

const singleSoundManifest = (
  manifest: MsuPackManifest, channel: string, soundId: number,
): MsuPackManifest => ({
  ...manifest,
  tracks: [],
  sounds: {
    [channel]: soundDefsOfChannel(manifest, channel).filter((sound) => sound.soundId === soundId),
  },
});

export { singleSoundManifest };
