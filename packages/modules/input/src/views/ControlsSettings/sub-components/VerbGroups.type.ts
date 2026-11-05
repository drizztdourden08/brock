/* @layer renderer-components @kind types */
import type { ButtonIcon, VerbBindings } from '../../../bindings';
import type { VerbDef } from '../../../bindings/verbs/verbs.type';
import type { VerbGroupDef } from '../ControlsSettings.type';
import type { BindingRowLabels } from './BindingRow.type';

interface VerbGroupsHeaders {
  action: string;
  group: string;
  binding: string;
}

interface VerbGroupsProps {
  groups: readonly VerbGroupDef[];
  verbs: readonly VerbDef[];
  bindings: VerbBindings;
  icons: Partial<Record<string, ButtonIcon | null>>;
  headers: VerbGroupsHeaders;
  labels: BindingRowLabels;
  onRebind: (verbId: string) => void;
}

export type { VerbGroupsHeaders, VerbGroupsProps };
