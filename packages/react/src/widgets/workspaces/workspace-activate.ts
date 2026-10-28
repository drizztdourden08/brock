/* @layer renderer-shell @kind logic */
import { migrateLayout, migrateToolbarLayout } from '@drizztdourden08/tessera/composites';
import { useToolbarLayoutStore } from '../../toolbars/useToolbarLayoutStore';
import { dropWindowGroups } from '../drop-window-groups';
import { useWidgetKitStore } from '../kits/useWidgetKitStore';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { workspaceDefaultView } from './workspace-default-view';
import { useWorkspaceStore } from './useWorkspaceStore';
import type { WorkspaceDef, WorkspaceView } from './workspace.type';

const liveView = (): WorkspaceView => ({
  widgetLayout: useWidgetLayoutStore.getState().layout,
  toolbarLayout: useToolbarLayoutStore.getState().layout,
});

const defaultOf = (def: WorkspaceDef): WorkspaceView =>
  workspaceDefaultView(def, useWidgetLayoutStore.getState().definitions, useToolbarLayoutStore.getState().definitions);

const savedOf = (def: WorkspaceDef): WorkspaceView => {
  const stored = useWorkspaceStore.getState().views[def.id];
  if (stored === undefined) return defaultOf(def);
  return {
    widgetLayout: dropWindowGroups(migrateLayout(stored.widgetLayout)),
    toolbarLayout: migrateToolbarLayout(stored.toolbarLayout, useToolbarLayoutStore.getState().definitions),
  };
};

const show = (view: WorkspaceView): void => {
  useWidgetKitStore.getState().close();
  useWidgetLayoutStore.getState().setLayout(view.widgetLayout);
  useToolbarLayoutStore.getState().setLayout(view.toolbarLayout);
};

const activateWorkspace = (id: string | null): void => {
  const state = useWorkspaceStore.getState();
  if (!state.ready || state.active === id) return;
  const def = id === null ? undefined : state.defs.find((each) => each.id === id);
  if (id !== null && def === undefined) throw new Error(`Unknown workspace "${id}". Known workspaces: ${state.defs.map((each) => each.id).join(', ') || 'none'}.`);
  if (state.active === null) useWorkspaceStore.setState({ base: liveView() });
  const view = def === undefined ? useWorkspaceStore.getState().base : savedOf(def);
  useWorkspaceStore.setState({ active: id });
  if (view !== null) show(view);
};

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
  const view = defaultOf(def);
  if (state.active === target) show(view);
  else useWorkspaceStore.getState().put(target, view);
};

export { activateWorkspace, resetWorkspace };
