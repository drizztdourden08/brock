/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuPackManifest } from '../types';
import { mergeClassicTracks } from './merge-classic-tracks';
import type { ClassicTrack } from './msu-classic-manifest.type';
import { synthesizeClassicManifest } from './synthesize-classic-manifest';

const effectivePackManifest = (
  config: MsuGameConfig, packName: string, manifest: MsuPackManifest | null, tracks: ClassicTrack[],
): MsuPackManifest =>
  manifest ? mergeClassicTracks(config, manifest, tracks) : synthesizeClassicManifest(config, packName, tracks);

export { effectivePackManifest };
