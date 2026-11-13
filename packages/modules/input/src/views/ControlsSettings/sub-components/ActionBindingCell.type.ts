/* @layer renderer-components @kind types */
import type { ActionRow } from '../behavior/controls-behavior.type';
import type { BindingRowLabels } from './BindingRow.type';

interface ActionBindingCellProps {
  actionLabel: string;
  slot: number;
  cell?: ActionRow;
  labels: BindingRowLabels;
  onRebind: (slot: number) => void;
  onClear: (mappingIndex: number) => void;
}

export type { ActionBindingCellProps };
