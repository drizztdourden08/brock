/* @layer core @kind types */
import type { MsuLayer } from './msu-layer.type';

interface MsuTrackDef {
  trackNum: number;
  layers: MsuLayer[];
}

export type { MsuTrackDef };
