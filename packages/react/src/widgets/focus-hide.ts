/* @layer renderer-shell @kind logic */
import { hideToolbar, isWidgetOpen, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { ToolbarDef } from '../toolbars/toolbar.type';
import type { FocusKeep, WidgetDef } from './widget.type';

const widgetsHidden = (layout: WidgetLayout, definitions: readonly WidgetDef[], keep: FocusKeep): WidgetLayout =>
  definitions.reduce((next, def) => (keep.widgets.includes(def.id) || !isWidgetOpen(next, def.id) ? next : removeEverywhere(next, def.id)), layout);

const toolbarsHidden = (layout: ToolbarLayout, definitions: readonly ToolbarDef[], keep: FocusKeep): ToolbarLayout =>
  definitions.reduce((next, def) => (keep.toolbars.includes(def.id) ? next : hideToolbar(next, def.id)), layout);

export { toolbarsHidden, widgetsHidden };
