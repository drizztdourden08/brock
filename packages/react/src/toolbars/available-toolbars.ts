/* @layer renderer-shell @kind logic */
import { toolbarAvailable } from './toolbar-available';
import type { ShowContext } from '../screens/show/show.type';
import type { ToolbarDef } from './toolbar.type';

const availableToolbars = (definitions: readonly ToolbarDef[], show?: ShowContext): readonly ToolbarDef[] => {
  const kept = definitions.filter((def) => toolbarAvailable(def, show));
  return kept.length === definitions.length ? definitions : kept;
};

export { availableToolbars };
