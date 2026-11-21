/* @layer renderer-shell @kind types */
import type { LayerEffect } from '../../../types';
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface LayerEffectsFieldProps {
  effects: LayerEffect[];
  layerId: string;
  disabled?: boolean;
  onChange: (effects: LayerEffect[]) => void;
}

interface EffectRowProps {
  effect: LayerEffect;
  index: number;
  disabled: boolean;
  onChange: (effect: LayerEffect) => void;
  onRemove: () => void;
}

interface EffectPreset {
  id: string;
  label: Text;
  description: Text;
  effects: LayerEffect[];
}

export type { LayerEffectsFieldProps, EffectRowProps, EffectPreset };
