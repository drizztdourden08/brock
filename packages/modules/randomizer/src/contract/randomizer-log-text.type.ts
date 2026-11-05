/* @layer core @kind types */
import type { RandomizerModeId } from '../augment';

interface RandomizerLogText {
  autoStart: (mode: RandomizerModeId, seed: string) => string;
  armed: (summary: string) => string | null;
  rerollFailed: (message: string) => string;
}

export type { RandomizerLogText };
