/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WorkspaceDef } from './workspace.type';

interface WorkspaceMenuInput {
  defs: readonly WorkspaceDef[];
  active: string | null;
  activate: (id: string | null) => void;
  reset: (id?: string | null) => void;
  text?: (value: Text) => string;
}

export type { WorkspaceMenuInput };
