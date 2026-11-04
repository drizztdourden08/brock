/* @layer core @kind types */
import type { LayerResume } from './layer-resume.type';

interface MsuResumeState {
  trackNum: number;
  layers: Record<string, LayerResume>;
  ambient?: { soundId: number; layers: Record<string, LayerResume> } | null;
}

export type { MsuResumeState };
