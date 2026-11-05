/* @layer renderer-shell @kind types */
import type { MsuLayer } from '../../../../types';
import type { ConfirmRequest } from '../../LayerEditor/LayerEditor.type';

interface ModeChangeParams {
  layer: MsuLayer;
  onConfirm: ConfirmRequest;
  onChange: (patch: Partial<Omit<MsuLayer, 'id'>>) => void;
}

export type { ModeChangeParams };
