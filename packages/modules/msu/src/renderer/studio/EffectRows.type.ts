/* @layer renderer-shell @kind types */
import type { useEffectsPanel } from './behavior/useEffectsPanel';

type EffectsPanelModel = ReturnType<typeof useEffectsPanel>;

type EffectRowsProps = {
  panel: EffectsPanelModel;
};

export type { EffectRowsProps };
