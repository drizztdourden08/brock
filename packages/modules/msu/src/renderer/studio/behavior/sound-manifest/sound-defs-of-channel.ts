/* @layer renderer-shell @kind logic */
import type { MsuPackManifest, MsuSoundDef } from '../../../../types';

const soundDefsOfChannel = (manifest: MsuPackManifest, channel: string): MsuSoundDef[] =>
  manifest.sounds?.[channel] ?? [];

export { soundDefsOfChannel };
