/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerProfileConfig } from '../../../augment';
import { LOBBY_FACT_LABELS as LABELS } from './lobby-facts.constants';

const randomizerFactsOf = (
  randomizer: RandomizerProfileConfig | undefined,
  sessionStatusLabel: string,
  connectionLabel: string,
  text: (value: Text) => string,
): FactsPanelFact[] | null => {
  if (!randomizer) return null;
  return [
    { label: text(LABELS.seed), value: randomizer.seed, title: randomizer.seed, mono: true },
    { label: text(LABELS.connection), value: connectionLabel },
    { label: text(LABELS.session), value: sessionStatusLabel },
  ];
};

export { randomizerFactsOf };
