/* @layer renderer-shell @kind logic */
import { useWorkspaceRegistryStore } from './useWorkspaceRegistryStore';
import type { WorkspaceDef } from './workspace.type';

const registerWorkspaces = (defs: readonly WorkspaceDef[]): (() => void) => useWorkspaceRegistryStore.getState().add(defs);

export { registerWorkspaces };
