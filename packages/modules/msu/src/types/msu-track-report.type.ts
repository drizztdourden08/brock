/* @layer core @kind types */
import type { MsuLayerReport } from './msu-layer-report.type';

interface MsuTrackReport {
  trackNum: number;
  elapsedSeconds: number;
  layers: MsuLayerReport[];
}

export type { MsuTrackReport };
