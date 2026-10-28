/* @layer renderer-shell @kind logic */
import type { WorkspaceDef } from './workspace.type';

const defineWorkspace = (input: WorkspaceDef): WorkspaceDef => ({ ...input });

export { defineWorkspace };
