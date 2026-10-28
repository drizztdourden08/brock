/* @layer renderer-shell @kind barrel */
export { defineWorkspace } from './define-workspace';
export { registerWorkspaces } from './register-workspaces';
export { workspaces } from './workspaces';
export { useWorkspaceMenuEntries } from './useWorkspaceMenuEntries';
export { buildWorkspaceMenuEntries } from './build-workspace-menu-entries';
export type { WorkspaceDef, WorkspaceListener, WorkspaceSnapshot } from './workspace.type';
