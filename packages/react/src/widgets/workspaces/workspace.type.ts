/* @layer renderer-shell @kind types */
import type { ToolbarLayout, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { ShowRule } from '../../screens/show/show.type';
import type { LayoutPreset } from '../layout-preset.type';
import type { WidgetMenuPlacement } from '../widget.type';

interface WorkspaceDef {
  id: string;
  label: string;
  icon?: string;
  order?: number;
  when?: ShowRule;
  layout?: LayoutPreset;
  toolbars?: readonly string[];
  menu?: WidgetMenuPlacement;
}

interface WorkspaceView {
  widgetLayout: WidgetLayout;
  toolbarLayout: ToolbarLayout;
}

interface StoredWorkspaceView {
  widgetLayout: unknown;
  toolbarLayout: unknown;
}

interface WorkspaceSnapshot {
  id: string;
  label: string;
  active: boolean;
  matches: boolean;
  saved: boolean;
}

type WorkspaceListener = (snapshot: readonly WorkspaceSnapshot[]) => void;

interface WorkspaceState {
  defs: readonly WorkspaceDef[];
  active: string | null;
  base: WorkspaceView | null;
  views: Record<string, StoredWorkspaceView>;
  ready: boolean;
  setDefs: (defs: readonly WorkspaceDef[]) => void;
  hydrate: (stored: unknown) => void;
  forget: () => void;
  put: (id: string, view: StoredWorkspaceView) => void;
}

interface WorkspaceRegistryState {
  registered: WorkspaceDef[];
  add: (defs: readonly WorkspaceDef[]) => () => void;
}

export type { StoredWorkspaceView, WorkspaceDef, WorkspaceListener, WorkspaceRegistryState, WorkspaceSnapshot, WorkspaceState, WorkspaceView };
