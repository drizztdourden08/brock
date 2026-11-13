/* @layer renderer-components @kind types */
import type { ActionGroupRow } from '../behavior/controls-behavior.type';
import type { BindingRowLabels } from './BindingRow.type';

interface ActionBindingRowProps {
  row: ActionGroupRow;
  columns: number;
  middleLabel?: string;
  labels: BindingRowLabels;
  onRebind: (actionId: string, slot: number) => void;
  onClear: (actionId: string, mappingIndex: number) => void;
}

export type { ActionBindingRowProps };
