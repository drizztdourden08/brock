/* @layer renderer-shell @kind logic */
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import type { ContextMenuCommand, ContextMenuContext, ContextMenuEntry } from '../context-menu/context-menu.type';
import { toolbarCanMove } from './toolbar-can-move';
import { toolbarLabelsOn } from './toolbar-labels-on';
import { toolbarSideOf } from './toolbar-side-of';
import { TOOLBAR_COMMANDS, TOOLBAR_SIDE_ORDER, TOOLBAR_SIDE_WORDS, TOOLBAR_TEXT } from './toolbar.constants';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const moveEntry = (layout: ToolbarLayout, id: string, side: ToolbarSide): ContextMenuCommand => ({
  command: TOOLBAR_COMMANDS.moveTo,
  label: TOOLBAR_SIDE_WORDS[side],
  args: { id, side },
  kind: 'radio',
  checked: toolbarSideOf(layout, id) === side,
  ...(toolbarCanMove(layout, id, side) ? {} : { disabled: true, reason: TOOLBAR_TEXT.noRoom }),
});

const toolbarContextEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const id = typeof context.data === 'string' ? context.data : null;
  if (id === null) return [];
  const { layout } = useToolbarLayoutStore.getState();
  return [
    { command: TOOLBAR_COMMANDS.labels, args: id, checked: toolbarLabelsOn(layout, id) },
    { label: TOOLBAR_TEXT.moveTo, items: TOOLBAR_SIDE_ORDER.map((side) => moveEntry(layout, id, side)) },
    'separator',
    { command: TOOLBAR_COMMANDS.hide, args: id },
  ];
};

export { toolbarContextEntries };
