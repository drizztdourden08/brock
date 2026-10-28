/* @layer renderer-shell @kind logic */
import { TOOLBAR_COLUMN_CHOICES } from './toolbar.constants';
import type { ToolbarColumnsArgs } from './toolbar.type';

const isToolbarColumnsArgs = (value: unknown): value is ToolbarColumnsArgs =>
  typeof value === 'object' && value !== null && 'id' in value && 'columns' in value
  && typeof value.id === 'string' && TOOLBAR_COLUMN_CHOICES.some((choice) => choice.value === value.columns);

export { isToolbarColumnsArgs };
