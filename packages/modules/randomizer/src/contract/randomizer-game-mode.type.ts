/* @layer core @kind types */
import type { RandomizerModeId } from '../augment';

interface RandomizerGameMode {
  id: RandomizerModeId;
  label: string;
  rank: number;
}

export type { RandomizerGameMode };
