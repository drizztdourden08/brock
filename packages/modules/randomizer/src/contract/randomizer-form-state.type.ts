/* @layer core @kind types */
import type { RandomizerModeId } from '../profile/randomizer-modes.type';

interface RandomizerFormState {
  enabled: boolean;
  seed: string;
  mode: RandomizerModeId;
}

export type { RandomizerFormState };
