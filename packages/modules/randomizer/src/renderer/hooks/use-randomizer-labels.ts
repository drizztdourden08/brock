/* @layer renderer-shell @kind hook */
import type { RandomizerLabels } from '../../contract/randomizer-labels.type';
import { DEFAULT_RANDOMIZER_LABELS } from '../bucket/randomizer-bucket.constants';
import { useRandomizerGame } from '../game-registry/use-randomizer-game';

const useRandomizerLabels = (): RandomizerLabels => {
  const game = useRandomizerGame();
  return { ...DEFAULT_RANDOMIZER_LABELS, ...game?.labels };
};

export { useRandomizerLabels };
