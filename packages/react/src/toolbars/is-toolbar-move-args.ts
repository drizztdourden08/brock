/* @layer renderer-shell @kind logic */
import { TOOLBAR_SIDE_ORDER } from './toolbar.constants';
import type { ToolbarMoveArgs } from './toolbar.type';

const isToolbarMoveArgs = (value: unknown): value is ToolbarMoveArgs =>
  typeof value === 'object' && value !== null && 'id' in value && 'side' in value
  && typeof value.id === 'string' && typeof value.side === 'string' && TOOLBAR_SIDE_ORDER.some((side) => side === value.side);

export { isToolbarMoveArgs };
