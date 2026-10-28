/* @layer renderer-shell @kind logic */
import { useToolbarLayoutStore } from '../../toolbars/useToolbarLayoutStore';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { workspaceDefaultOf } from './workspace-default-of';
import { activateWorkspace } from './workspace-activate';
import { showWorkspaceView } from './workspace-show';
import { useWorkspaceStore } from './useWorkspaceStore';

const resetWorkspace = (id?: string | null): void => {
  const state = useWorkspaceStore.getState();
  const target = id === undefined ? state.active : id;
  if (target === null) {
    activateWorkspace(null);
    useWidgetLayoutStore.getState().reset();
    useToolbarLayoutStore.getState().reset();
    return;
  }
  const def = state.defs.find((each) => each.id === target);
  if (def === undefined) throw new Error(`Unknown workspace "${target}". Known workspaces: ${state.defs.map((each) => each.id).join(', ') || 'none'}.`);
  const view = workspaceDefaultOf(def);
  if (state.active === target) showWorkspaceView(view);
  else useWorkspaceStore.getState().put(target, view);
};

export { resetWorkspace };
