/* @layer renderer-shell @kind logic */
import { useToolbarLayoutStore } from '../../toolbars/useToolbarLayoutStore';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { workspaceDefaultView } from './workspace-default-view';
import type { WorkspaceDef, WorkspaceView } from './workspace.type';

const workspaceDefaultOf = (def: WorkspaceDef): WorkspaceView =>
  workspaceDefaultView(def, useWidgetLayoutStore.getState().definitions, useToolbarLayoutStore.getState().definitions);

export { workspaceDefaultOf };
