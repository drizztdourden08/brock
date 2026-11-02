/* @layer renderer-shell @kind logic */
import { isWidgetOpen, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { FocusKeep, WidgetDef } from './widget.type';

const widgetsHidden = (layout: WidgetLayout, definitions: readonly WidgetDef[], keep: FocusKeep): WidgetLayout =>
  definitions.reduce((next, def) => (keep.widgets.includes(def.id) || !isWidgetOpen(next, def.id) ? next : removeEverywhere(next, def.id)), layout);

export { widgetsHidden };
