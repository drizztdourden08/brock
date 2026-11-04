/* @layer core @kind types */
import type { RandomizerModeId } from '../augment';

interface RandomizerFormState {
  enabled: boolean;
  seed: string;
  mode: RandomizerModeId;
}

export type { RandomizerFormState };
