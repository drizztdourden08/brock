/* @layer renderer-shell @kind logic */
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

const subscribe = (listener: WorkspaceListener): (() => void) => {
  let last = JSON.stringify(list());
  const check = (): void => {
    const next = list();
    const key = JSON.stringify(next);
    if (key === last) return;
    last = key;
    listener(next);
  };
  const stops = [useWorkspaceStore.subscribe(check), useShowFlagsStore.subscribe(check)];
  return () => {
    for (const stop of stops) stop();
  };
};

const workspaces = {
  list,
  active: (): string | null => useWorkspaceStore.getState().active,
  activate: activateWorkspace,
  reset: resetWorkspace,
  subscribe,
};

export { workspaces };
