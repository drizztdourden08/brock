/* @layer renderer-components @kind types */
import type { ButtonIcon, InputBinding } from '../../../bindings';
import type { ActionDef } from '../ControlsSettings.type';
import type { BindingRowLabels } from './BindingRow.type';

interface ActionBindingRowProps {
  action: ActionDef;
  mappingIndex: number;
  binding: InputBinding;
  bindingIcon?: ButtonIcon | null;
  deviceIconUrl?: string | null;
  middleLabel?: string;
  labels: BindingRowLabels;
  onRebind: (actionId: string) => void;
  onClear: (actionId: string, mappingIndex: number) => void;
}

export type { ActionBindingRowProps };
