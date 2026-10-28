/* @layer renderer-shell @kind types */
import type { WorkspaceDef } from './workspace.type';

interface WorkspaceMenuInput {
  defs: readonly WorkspaceDef[];
  active: string | null;
  activate: (id: string | null) => void;
  reset: (id?: string | null) => void;
}

export type { WorkspaceMenuInput };
