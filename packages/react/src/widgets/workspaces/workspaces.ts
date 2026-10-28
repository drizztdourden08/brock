/* @layer renderer-shell @kind logic */
import { subscribeSnapshots } from '../subscribe-snapshots';
import { useShowFlagsStore } from '../../screens/show/useShowFlagsStore';
import { chosenWorkspace } from './chosen-workspace';
import { useWorkspaceStore } from './useWorkspaceStore';
import { activateWorkspace } from './workspace-activate';
import { resetWorkspace } from './workspace-reset';
import type { WorkspaceListener, WorkspaceSnapshot } from './workspace.type';

const list = (): WorkspaceSnapshot[] => {
  const { defs, active, views } = useWorkspaceStore.getState();
  const chosen = chosenWorkspace(defs);
  return defs.map((def) => ({ id: def.id, label: def.label, active: active === def.id, matches: chosen === def.id, saved: views[def.id] !== undefined }));
};

const subscribe = (listener: WorkspaceListener): (() => void) =>
  subscribeSnapshots(list, [(on) => useWorkspaceStore.subscribe(on), (on) => useShowFlagsStore.subscribe(on)], listener);

const workspaces = {
  list,
  active: (): string | null => useWorkspaceStore.getState().active,
  activate: activateWorkspace,
  reset: resetWorkspace,
  subscribe,
};

export { workspaces };
