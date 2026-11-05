/* @layer renderer-components @kind types */
import type { ButtonIcon, InputBinding } from '../../../bindings';
import type { VerbDef } from '../../../bindings/verbs/verbs.type';
import type { BindingRowLabels } from './BindingRow.type';

interface VerbRowProps {
  verb: VerbDef;
  groupTitle: string;
  binding: InputBinding;
  icon?: ButtonIcon | null;
  labels: BindingRowLabels;
  onRebind: (verbId: string) => void;
}

export type { VerbRowProps };
