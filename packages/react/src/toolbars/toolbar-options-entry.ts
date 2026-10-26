/* @layer renderer-shell @kind logic */
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { runToolbarCommand } from './run-toolbar-command';
import { toolbarCanMove } from './toolbar-can-move';
import { toolbarLabelsOn } from './toolbar-labels-on';
import { toolbarSideOf } from './toolbar-side-of';
import { TOOLBAR_COMMANDS, TOOLBAR_KEY_PREFIX, TOOLBAR_SIDE_ORDER, TOOLBAR_TEXT } from './toolbar.constants';
import type { ToolbarDef } from './toolbar.type';

const moveItem = (layout: ToolbarLayout, id: string, side: ToolbarSide): MenuItem => ({
  key: `${TOOLBAR_KEY_PREFIX}${id}-move-${side}`,
  label: `${TOOLBAR_TEXT.moveTo} ${side}`,
  checked: toolbarSideOf(layout, id) === side,
  disabled: !toolbarCanMove(layout, id, side),
  onClick: () => runToolbarCommand(TOOLBAR_COMMANDS.moveTo, { id, side }),
});

const toolbarOptionsEntry = (definition: ToolbarDef, layout: ToolbarLayout): MenuItem => {
  const { id } = definition;
  const children: MenuEntry[] = [
    { key: `${TOOLBAR_KEY_PREFIX}${id}-labels`, label: TOOLBAR_TEXT.labels, checked: toolbarLabelsOn(layout, id), onClick: () => runToolbarCommand(TOOLBAR_COMMANDS.labels, id) },
    ...TOOLBAR_SIDE_ORDER.map((side) => moveItem(layout, id, side)),
    { key: `${TOOLBAR_KEY_PREFIX}${id}-hide`, label: TOOLBAR_TEXT.hide, onClick: () => runToolbarCommand(TOOLBAR_COMMANDS.hide, id) },
  ];
  return { key: `${TOOLBAR_KEY_PREFIX}${id}-options`, label: definition.label, children };
};

export { toolbarOptionsEntry };
