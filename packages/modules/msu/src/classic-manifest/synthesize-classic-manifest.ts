/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuPackManifest } from '../types';
import { classicTrackDef } from './classic-track-def';
import { dedupeByTrackNum } from './dedupe-by-track-num';
import type { ClassicTrack } from './msu-classic-manifest.type';

const synthesizeClassicManifest = (
  config: MsuGameConfig, packName: string, tracks: ClassicTrack[],
): MsuPackManifest => {
  const now = Date.now();
  return {
    version: 1,
    meta: { name: packName, createdAt: now, modifiedAt: now },
    tracks: dedupeByTrackNum(tracks).map((t) => classicTrackDef(config, t)),
  };
};

export { synthesizeClassicManifest };
