/* @layer renderer-components @kind types */
import type { ButtonIcon, InputBinding } from '../../../bindings';

interface BindingRowLabels {
  rebind: (name: string) => string;
  clear: string;
}

interface BindingRowProps {
  actionLabel: string;
  middleLabel?: string;
  middleGlyph?: string;
  binding: InputBinding;
  bindingIcon?: ButtonIcon | null;
  deviceIconUrl?: string | null;
  labels: BindingRowLabels;
  onRebind: () => void;
  onClear?: () => void;
}

export type { BindingRowLabels, BindingRowProps };
