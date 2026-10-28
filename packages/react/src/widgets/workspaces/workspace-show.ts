/* @layer renderer-shell @kind logic */
import { useToolbarLayoutStore } from '../../toolbars/useToolbarLayoutStore';
import { useWidgetKitStore } from '../kits/useWidgetKitStore';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import type { WorkspaceView } from './workspace.type';

const showWorkspaceView = (view: WorkspaceView): void => {
  useWidgetKitStore.getState().close();
  useWidgetLayoutStore.getState().setLayout(view.widgetLayout);
  useToolbarLayoutStore.getState().setLayout(view.toolbarLayout);
};

export { showWorkspaceView };
