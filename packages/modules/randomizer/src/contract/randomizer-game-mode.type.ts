/* @layer core @kind types */
import type { ShowContext } from '@drizztdourden08/brock-react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { RandomizerModeId } from '../augment';

interface RandomizerGameMode {
  id: RandomizerModeId;
  label: Text;
  rank: number;
  when?: (ctx: ShowContext) => boolean;
}

export type { RandomizerGameMode };
