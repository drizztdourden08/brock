/* @layer renderer-shell @kind logic */
import { toolbarIdsOf } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import { TOOLBAR_SIDE_ORDER } from './toolbar.constants';

const toolbarSideOf = (layout: ToolbarLayout, id: string): ToolbarSide | null =>
  TOOLBAR_SIDE_ORDER.find((side) => toolbarIdsOf(layout, side).includes(id)) ?? null;

export { toolbarSideOf };
