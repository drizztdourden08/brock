/* @layer renderer-shell @kind logic */
import type { MsuPackManifest } from '../../../../types';
import { soundDefsOfChannel } from './sound-defs-of-channel';
import { withChannelDefs } from './with-channel-defs';

const withoutSound = (
  manifest: MsuPackManifest, channel: string, soundId: number,
): MsuPackManifest => withChannelDefs(
  manifest,
  channel,
  soundDefsOfChannel(manifest, channel).filter((sound) => sound.soundId !== soundId),
);

export { withoutSound };
