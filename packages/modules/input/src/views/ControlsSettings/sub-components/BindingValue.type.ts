/* @layer renderer-components @kind types */
import type { ButtonIcon, InputBinding } from '../../../bindings';

interface BindingValueProps {
  binding: InputBinding;
  bindingIcon?: ButtonIcon | null;
  deviceIconUrl?: string | null;
  clearLabel: string;
  onClear?: () => void;
}

export type { BindingValueProps };
