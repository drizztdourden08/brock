/* @layer renderer-shell @kind logic */
import type { ShowContext } from '../../screens/show/show.type';
import { matchingWorkspaces } from './matching-workspaces';
import type { WorkspaceDef } from './workspace.type';

const chosenWorkspace = (defs: readonly WorkspaceDef[], show?: ShowContext): string | null => matchingWorkspaces(defs, show)[0]?.id ?? null;

export { chosenWorkspace };
