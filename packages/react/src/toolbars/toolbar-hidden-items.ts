/* @layer renderer-shell @kind logic */
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';
import { NO_HIDDEN_ITEMS } from './toolbar.constants';

const toolbarHiddenItems = (layout: ToolbarLayout, id: string): readonly string[] => layout.items?.[id] ?? NO_HIDDEN_ITEMS;

export { toolbarHiddenItems };
