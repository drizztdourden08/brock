/* @layer core @kind types */
import type { MsuLayerReport } from './msu-layer-report.type';

interface MsuChannelReport {
  channel: string;
  kind: 'stateful' | 'additive';
  id: number;
  elapsedSeconds: number;
  layers: MsuLayerReport[];
  setCount: number;
  voiceCap: number | null;
}

export type { MsuChannelReport };
