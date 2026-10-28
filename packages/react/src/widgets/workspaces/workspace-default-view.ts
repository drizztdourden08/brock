/* @layer renderer-shell @kind logic */
import { createToolbarLayout, hideToolbar, isToolbarShown, toggleToolbar } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';
import type { ToolbarDef } from '../../toolbars/toolbar.type';
import { presetLayout } from '../preset-layout';
import type { WidgetDef } from '../widget.type';
import type { WorkspaceDef, WorkspaceView } from './workspace.type';

const toolbarsFor = (def: WorkspaceDef, toolbars: readonly ToolbarDef[]): ToolbarLayout => {
  const base = createToolbarLayout(toolbars);
  const wanted = def.toolbars;
  if (wanted === undefined) return base;
  return toolbars.reduce((layout, bar) => {
    const shown = isToolbarShown(layout, bar.id);
    if (wanted.includes(bar.id)) return shown ? layout : toggleToolbar(layout, bar.id, toolbars);
    return shown ? hideToolbar(layout, bar.id) : layout;
  }, base);
};

const workspaceDefaultView = (def: WorkspaceDef, widgets: readonly WidgetDef[], toolbars: readonly ToolbarDef[]): WorkspaceView => ({
  widgetLayout: presetLayout(def.layout ?? null, widgets),
  toolbarLayout: toolbarsFor(def, toolbars),
});

export { workspaceDefaultView };
