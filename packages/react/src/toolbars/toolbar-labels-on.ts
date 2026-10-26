/* @layer renderer-shell @kind logic */
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';

const toolbarLabelsOn = (layout: ToolbarLayout, id: string): boolean => layout.labels?.[id] ?? true;

export { toolbarLabelsOn };
