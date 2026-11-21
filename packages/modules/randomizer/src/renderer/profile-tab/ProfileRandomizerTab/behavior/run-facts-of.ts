/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerProfileConfig } from '../../../../augment';
import { MODE_LABELS } from '../../../wizard/wizard.constants';
import { FACT_LABELS, NONE, OFF, ON, SET } from '../ProfileRandomizerTab.constants';

const connectionFactsOf = (randomizer: RandomizerProfileConfig, text: (value: Text) => string): FactsPanelFact[] => [
  ...(randomizer.serverUrl ? [{ label: text(FACT_LABELS.server), value: randomizer.serverUrl, mono: true }] : []),
  { label: text(FACT_LABELS.name), value: randomizer.slotName ?? text(NONE) },
  { label: text(FACT_LABELS.password), value: randomizer.password ? text(SET) : text(NONE) },
  { label: text(FACT_LABELS.deathLink), value: randomizer.deathLink ? text(ON) : text(OFF) },
];

const runFactsOf = (randomizer: RandomizerProfileConfig, text: (value: Text) => string, modeLabel?: Text): FactsPanelFact[] => [
  { label: text(FACT_LABELS.seed), value: randomizer.seed, mono: true, copyable: true },
  { label: text(FACT_LABELS.type), value: text(modeLabel ?? MODE_LABELS[randomizer.mode] ?? randomizer.mode) },
  ...(randomizer.mode === 'local' ? [] : connectionFactsOf(randomizer, text)),
];

export { runFactsOf };
