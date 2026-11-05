/* @layer renderer-shell @kind logic */
import type { MsuPackManifest } from '../../../../types';
import { soundDefsOfChannel } from './sound-defs-of-channel';

const syncGroupOf = (
  manifest: MsuPackManifest, channel: string, soundId: number,
): string | undefined =>
  soundDefsOfChannel(manifest, channel).find((sound) => sound.soundId === soundId)?.syncGroup;

export { syncGroupOf };
