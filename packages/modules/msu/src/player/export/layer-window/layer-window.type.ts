/* @layer core @kind types */
import type { MsuLayer } from '../../../types';

interface ResolvedLayer {
  layer: MsuLayer;
  index: number;
  buffers: AudioBuffer[];
}

export type { ResolvedLayer };
