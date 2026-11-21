/* @layer renderer-shell @kind logic */
import type { I18n, Text } from '@drizztdourden08/brock-core/i18n';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { PRESETS } from '../LayerEffectsField.constants';

const presetOptions = (t: I18n['t'], text: (value: Text) => string): SelectOption[] => [
  { value: '', label: t('msu:effects.none'), description: t('msu:effects.noneHint') },
  ...PRESETS.map((preset) => ({ value: preset.id, label: text(preset.label), description: text(preset.description) })),
];

export { presetOptions };
