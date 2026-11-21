/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { LayerEffect } from '../../../types';
import type { EffectPreset } from './LayerEffectsField.type';

const PRESETS: EffectPreset[] = [
  {
    id: 'muffled',
    label: msg('msu:effects.preset.muffled'),
    description: msg('msu:effects.preset.muffledHint'),
    effects: [{ kind: 'lowpass', frequencyHz: 900 }, { kind: 'eq', lowDb: 2, midDb: -2, highDb: -6 }],
  },
  {
    id: 'distant',
    label: msg('msu:effects.preset.distant'),
    description: msg('msu:effects.preset.distantHint'),
    effects: [{ kind: 'highpass', frequencyHz: 200 }, { kind: 'lowpass', frequencyHz: 3000 }, { kind: 'eq', lowDb: -4, midDb: -2, highDb: -3 }],
  },
  {
    id: 'thin',
    label: msg('msu:effects.preset.thin'),
    description: msg('msu:effects.preset.thinHint'),
    effects: [{ kind: 'highpass', frequencyHz: 600 }, { kind: 'eq', lowDb: -8, midDb: 4, highDb: -2 }],
  },
  {
    id: 'warm',
    label: msg('msu:effects.preset.warm'),
    description: msg('msu:effects.preset.warmHint'),
    effects: [{ kind: 'eq', lowDb: 3, midDb: 0, highDb: -2 }],
  },
];

const DEFAULT_EFFECT: Record<LayerEffect['kind'], LayerEffect> = {
  lowpass: { kind: 'lowpass', frequencyHz: 1200 },
  highpass: { kind: 'highpass', frequencyHz: 300 },
  eq: { kind: 'eq', lowDb: 0, midDb: 0, highDb: 0 },
};

const MIN_HZ = 20;
const MAX_HZ = 20000;
const MAX_DB = 12;

const EFFECTS_LABEL = msg('msu:effects.label');
const EFFECTS_HINT = msg('msu:effects.hint');

export {
  PRESETS, DEFAULT_EFFECT, MIN_HZ, MAX_HZ, MAX_DB,
  EFFECTS_LABEL, EFFECTS_HINT,
};
