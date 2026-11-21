/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { RandomizerProfileConfig } from '../../../../augment';
import { MODE_LABELS } from '../../../wizard/wizard.constants';
import { NONE, OFF, ON } from '../ProfileRandomizerTab.constants';

const connectionFactsOf = (randomizer: RandomizerProfileConfig): FactsPanelFact[] => [
  ...(randomizer.serverUrl ? [{ label: 'Server', value: randomizer.serverUrl, mono: true }] : []),
  { label: 'Name', value: randomizer.slotName ?? NONE },
  { label: 'Password', value: randomizer.password ? 'Set' : NONE },
  { label: 'Death Link', value: randomizer.deathLink ? ON : OFF },
];

const runFactsOf = (randomizer: RandomizerProfileConfig, text: (value: Text) => string, modeLabel?: Text): FactsPanelFact[] => [
  { label: 'Seed', value: randomizer.seed, mono: true, copyable: true },
  { label: 'Type', value: text(modeLabel ?? MODE_LABELS[randomizer.mode] ?? randomizer.mode) },
  ...(randomizer.mode === 'local' ? [] : connectionFactsOf(randomizer)),
];

export { runFactsOf };
