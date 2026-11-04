/* @layer core @kind types */
import type { LayerEffect } from './layer-effect.type';
import type { LayerPlayMode } from './layer-play-mode.type';

interface MsuLayer {
  id: string;
  name: string;
  files: string[];
  mode: LayerPlayMode;
  effects?: LayerEffect[];
  volume: number;
  chance?: number;
  loopSample?: number;
}

export type { MsuLayer };
