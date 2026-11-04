/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuPackManifest } from '../types';
import { classicTrackDef } from './classic-track-def';
import { dedupeByTrackNum } from './dedupe-by-track-num';
import type { ClassicTrack } from './msu-classic-manifest.type';

const mergeClassicTracks = (
  config: MsuGameConfig, manifest: MsuPackManifest, tracks: ClassicTrack[],
): MsuPackManifest => {
  const authored = new Set(manifest.tracks.map((t) => t.trackNum));
  const filled = dedupeByTrackNum(tracks)
    .filter((t) => !authored.has(t.trackNum))
    .map((t) => classicTrackDef(config, t));
  if (filled.length === 0) return manifest;
  return { ...manifest, tracks: [...manifest.tracks, ...filled].sort((a, b) => a.trackNum - b.trackNum) };
};

export { mergeClassicTracks };
