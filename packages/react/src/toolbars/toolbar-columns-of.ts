/* @layer renderer-shell @kind logic */
import type { ToolbarColumns, ToolbarLayout } from '@drizztdourden08/tessera/composites';
import { TOOLBAR_DEFAULT_COLUMNS } from './toolbar.constants';

const toolbarColumnsOf = (layout: ToolbarLayout, id: string): ToolbarColumns => layout.columns?.[id] ?? TOOLBAR_DEFAULT_COLUMNS;

export { toolbarColumnsOf };
