/* @layer renderer-shell @kind logic */
import { isShown } from '../screens/show/is-shown';
import type { ShowContext } from '../screens/show/show.type';
import type { ToolbarDef } from './toolbar.type';

const toolbarAvailable = (def: Pick<ToolbarDef, 'when'>, show?: ShowContext): boolean => isShown(def.when, show);

export { toolbarAvailable };
