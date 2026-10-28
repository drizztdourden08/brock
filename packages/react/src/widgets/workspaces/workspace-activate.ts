/* @layer renderer-shell @kind logic */
import { migrateLayout, migrateToolbarLayout } from '@drizztdourden08/tessera/composites';
import { useToolbarLayoutStore } from '../../toolbars/useToolbarLayoutStore';
import { dropWindowGroups } from '../drop-window-groups';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { workspaceDefaultOf } from './workspace-default-of';
import { showWorkspaceView } from './workspace-show';
import { useWorkspaceStore } from './useWorkspaceStore';
import type { WorkspaceDef, WorkspaceView } from './workspace.type';

const liveView = (): WorkspaceView => ({
  widgetLayout: useWidgetLayoutStore.getState().layout,
  toolbarLayout: useToolbarLayoutStore.getState().layout,
});

const savedOf = (def: WorkspaceDef): WorkspaceView => {
  const stored = useWorkspaceStore.getState().views[def.id];
  if (stored === undefined) return workspaceDefaultOf(def);
  return {
    widgetLayout: dropWindowGroups(migrateLayout(stored.widgetLayout)),
    toolbarLayout: migrateToolbarLayout(stored.toolbarLayout, useToolbarLayoutStore.getState().definitions),
  };
};

const activateWorkspace = (id: string | null): void => {
  const state = useWorkspaceStore.getState();
  if (!state.ready || state.active === id) return;
  const def = id === null ? undefined : state.defs.find((each) => each.id === id);
  if (id !== null && def === undefined) throw new Error(`Unknown workspace "${id}". Known workspaces: ${state.defs.map((each) => each.id).join(', ') || 'none'}.`);
  if (state.active === null) useWorkspaceStore.setState({ base: liveView() });
  const view = def === undefined ? useWorkspaceStore.getState().base : savedOf(def);
  useWorkspaceStore.setState({ active: id });
  if (view !== null) showWorkspaceView(view);
};

export { activateWorkspace };
