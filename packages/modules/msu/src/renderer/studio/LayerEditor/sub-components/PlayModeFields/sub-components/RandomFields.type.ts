/* @layer renderer-shell @kind types */
import type { LayerPlayMode } from '../../../../../../types';

type RandomFieldsProps = {
  mode: Extract<LayerPlayMode, { kind: 'random' }>;
  layerId: string;
  disabled: boolean;
  onChange: (mode: LayerPlayMode) => void;
};

export type { RandomFieldsProps };
