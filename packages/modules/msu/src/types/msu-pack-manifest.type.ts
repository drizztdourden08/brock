/* @layer core @kind types */
import type { MsuPackMeta } from './msu-pack-meta.type';
import type { MsuSoundDef } from './msu-sound-def.type';
import type { MsuTrackDef } from './msu-track-def.type';

interface MsuPackManifest {
  version: 1;
  meta: MsuPackMeta;
  tracks: MsuTrackDef[];
  sounds?: Record<string, MsuSoundDef[] | undefined>;
  files?: string[];
}

export type { MsuPackManifest };
