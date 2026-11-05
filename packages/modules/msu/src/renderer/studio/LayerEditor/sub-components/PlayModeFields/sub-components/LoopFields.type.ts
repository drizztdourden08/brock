/* @layer renderer-shell @kind types */
import type { LayerPlayMode } from '../../../../../../types';

type LoopFieldsProps = {
  mode: Extract<LayerPlayMode, { kind: 'loop' }>;
  layerId: string;
  disabled: boolean;
  onChange: (mode: LayerPlayMode) => void;
};

export type { LoopFieldsProps };
