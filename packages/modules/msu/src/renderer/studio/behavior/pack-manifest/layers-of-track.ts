/* @layer renderer-shell @kind logic */
import type { MsuLayer, MsuPackManifest } from '../../../../types';

const layersOfTrack = (manifest: MsuPackManifest, trackNum: number): MsuLayer[] =>
  manifest.tracks.find((t) => t.trackNum === trackNum)?.layers ?? [];

export { layersOfTrack };
