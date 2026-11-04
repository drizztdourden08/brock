/* @layer core @kind types */
import type { SoundingVoice } from './sounding-voice.type';

interface MsuLayerReport {
  layerId: string;
  layerName: string;
  modeKind: string;
  fileName: string | null;
  nextEventInSeconds: number | null;
  waitSeconds: number | null;
  positionSeconds: number | null;
  durationSeconds: number | null;
  sounding: boolean;
  voiceCount: number;
  voices: SoundingVoice[];
}

export type { MsuLayerReport };
