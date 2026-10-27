/* @layer renderer-shell @kind logic */
import { paneOf, patchPane } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';

const focusEdit = (layout: WidgetLayout, id: string): WidgetLayout => {
  const pane = paneOf(layout.dock, id);
  if (pane) return { ...layout, dock: patchPane(layout.dock, pane.key, { active: id }) };
  const entry = layout.floating.find((each) => each.id === id);
  return entry ? { ...layout, floating: [...layout.floating.filter((each) => each !== entry), entry] } : layout;
};

export { focusEdit };
