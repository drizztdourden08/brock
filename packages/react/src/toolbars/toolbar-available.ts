/* @layer renderer-shell @kind logic */
import { isShown } from '../screens/show/is-shown';
import type { ShowContext } from '../screens/show/show.type';
import type { ToolbarDef } from './toolbar.type';

const toolbarAvailable = (def: Pick<ToolbarDef, 'when'>, show?: ShowContext): boolean => isShown(def.when, show);

const availableToolbars = (definitions: readonly ToolbarDef[], show?: ShowContext): readonly ToolbarDef[] => {
  const kept = definitions.filter((def) => toolbarAvailable(def, show));
  return kept.length === definitions.length ? definitions : kept;
};

export { availableToolbars, toolbarAvailable };
