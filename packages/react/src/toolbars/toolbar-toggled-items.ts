/* @layer renderer-shell @kind logic */
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';
import { toolbarHiddenItems } from './toolbar-hidden-items';

const toolbarToggledItems = (layout: ToolbarLayout, id: string, item: string): string[] => {
  const hidden = toolbarHiddenItems(layout, id);
  return hidden.includes(item) ? hidden.filter((each) => each !== item) : [...hidden, item];
};

export { toolbarToggledItems };
