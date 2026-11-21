/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const effectKindOptions = (t: I18n['t']): SelectOption[] => [
  { value: 'lowpass', label: t('msu:effects.kind.lowpass'), description: t('msu:effects.kind.lowpassHint') },
  { value: 'highpass', label: t('msu:effects.kind.highpass'), description: t('msu:effects.kind.highpassHint') },
  { value: 'eq', label: t('msu:effects.kind.eq'), description: t('msu:effects.kind.eqHint') },
];

export { effectKindOptions };
