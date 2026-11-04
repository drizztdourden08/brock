/* @layer core @kind types */
import type { MsuLayer } from './msu-layer.type';

interface MsuSoundDef {
  soundId: number;
  layers: MsuLayer[];
  syncGroup?: string;
}

export type { MsuSoundDef };
