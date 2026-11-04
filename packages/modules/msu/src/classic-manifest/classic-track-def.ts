/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuTrackDef } from '../types';
import type { ClassicTrack } from './msu-classic-manifest.type';

const classicTrackDef = (config: MsuGameConfig, track: ClassicTrack): MsuTrackDef => ({
  trackNum: track.trackNum,
  layers: [{
    id: `track-${track.trackNum}`,
    name: `Track ${track.trackNum}`,
    files: [track.fileName],
    mode: config.trackLoops(track.trackNum) ? { kind: 'loop', order: 'single' } : { kind: 'once' },
    volume: 100,
  }],
});

export { classicTrackDef };
