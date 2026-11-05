/* @layer renderer-shell @kind logic */
import type { MsuPackManifest } from '../../../../types';

const singleTrackManifest = (manifest: MsuPackManifest, trackNum: number): MsuPackManifest => ({
  ...manifest,
  tracks: manifest.tracks.filter((t) => t.trackNum === trackNum),
});

export { singleTrackManifest };
