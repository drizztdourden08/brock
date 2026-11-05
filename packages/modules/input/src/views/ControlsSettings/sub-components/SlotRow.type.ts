/* @layer renderer-components @kind types */
import type { BindingSlot } from '../../../bindings';
import type { BindingRowLabels } from './BindingRow.type';

interface SlotRowProps {
  slot: BindingSlot;
  assignment: string;
  labels: BindingRowLabels;
  removeLabel: (name: string) => string;
  onRebind: (slot: BindingSlot) => void;
  onRemove: (index: number) => void;
}

export type { SlotRowProps };
