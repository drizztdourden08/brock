/* @layer renderer-shell @kind logic */
import { moveToolbarToSide } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import { toolbarSideOf } from './toolbar-side-of';

const toolbarCanMove = (layout: ToolbarLayout, id: string, side: ToolbarSide): boolean =>
  toolbarSideOf(layout, id) === side || moveToolbarToSide(layout, id, side) !== layout;

export { toolbarCanMove };
