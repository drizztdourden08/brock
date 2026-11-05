/* @layer renderer-shell @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerProfileConfig } from '../../../augment';

const randomizerFactsOf = (
  randomizer: RandomizerProfileConfig | undefined,
  sessionStatusLabel: string,
  connectionLabel: string,
): FactsPanelFact[] | null => {
  if (!randomizer) return null;
  return [
    { label: 'Seed', value: randomizer.seed, title: randomizer.seed, mono: true },
    { label: 'Connection', value: connectionLabel },
    { label: 'Session', value: sessionStatusLabel },
  ];
};

export { randomizerFactsOf };
