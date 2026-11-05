/* @layer core @kind types */
import type { ShowContext } from '@drizztdourden08/brock-react';
import type { RandomizerModeId } from '../augment';

interface RandomizerGameMode {
  id: RandomizerModeId;
  label: string;
  rank: number;
  when?: (ctx: ShowContext) => boolean;
}

export type { RandomizerGameMode };
