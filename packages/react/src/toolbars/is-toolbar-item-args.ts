/* @layer renderer-shell @kind logic */
import type { ToolbarItemArgs } from './toolbar.type';

const isToolbarItemArgs = (value: unknown): value is ToolbarItemArgs =>
  typeof value === 'object' && value !== null && 'id' in value && 'item' in value && typeof value.id === 'string' && typeof value.item === 'string';

export { isToolbarItemArgs };
