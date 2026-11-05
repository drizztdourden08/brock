/* @layer renderer-shell @kind logic */
import type { MsuPackManifest, MsuSoundDef } from '../../../../types';

const withChannelDefs = (
  manifest: MsuPackManifest, channel: string, defs: MsuSoundDef[],
): MsuPackManifest => {
  const next: Record<string, MsuSoundDef[]> = {};
  for (const [name, existing] of Object.entries(manifest.sounds ?? {})) {
    if (name !== channel && existing !== undefined && existing.length > 0) next[name] = existing;
  }
  if (defs.length > 0) next[channel] = defs;
  return { ...manifest, sounds: Object.keys(next).length > 0 ? next : undefined };
};

export { withChannelDefs };
