/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';
import { mapLayers } from './map-layers';
import { sameName } from './same-name';

const withLoopSampleCarried = (
  manifest: MsuPackManifest, fileName: string, loopSample: number,
): MsuPackManifest =>
  mapLayers(manifest, (layer) => (layer.loopSample === undefined && layer.files.some((file) => sameName(file, fileName))
    ? { ...layer, loopSample }
    : layer));

export { withLoopSampleCarried };
