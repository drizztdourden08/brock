/* @layer renderer-shell @kind logic */
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import type { ContextMenuCommand, ContextMenuContext, ContextMenuEntry } from '../context-menu/context-menu.type';
import { toolbarCanMove } from './toolbar-can-move';
import { toolbarColumnsOf } from './toolbar-columns-of';
import { toolbarHiddenItems } from './toolbar-hidden-items';
import { toolbarLabelsOn } from './toolbar-labels-on';
import { toolbarSideOf } from './toolbar-side-of';
import { TOOLBAR_COLUMN_CHOICES, TOOLBAR_COMMANDS, TOOLBAR_SIDE_ORDER, TOOLBAR_SIDE_WORDS, TOOLBAR_TEXT } from './toolbar.constants';
import type { ToolbarDef } from './toolbar.type';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const moveEntry = (layout: ToolbarLayout, id: string, side: ToolbarSide): ContextMenuCommand => ({
  command: TOOLBAR_COMMANDS.moveTo,
  label: TOOLBAR_SIDE_WORDS[side],
  args: { id, side },
  kind: 'radio',
  checked: toolbarSideOf(layout, id) === side,
  ...(toolbarCanMove(layout, id, side) ? {} : { disabled: true, reason: TOOLBAR_TEXT.noRoom }),
});

const itemsEntries = (layout: ToolbarLayout, def: ToolbarDef | undefined): ContextMenuEntry[] => {
  if (def?.items === undefined || def.items.length === 0) return [];
  const hidden = toolbarHiddenItems(layout, def.id);
  const items = def.items.map((item): ContextMenuCommand => ({
    command: TOOLBAR_COMMANDS.item,
    label: item.label,
    args: { id: def.id, item: item.id },
    kind: 'check',
    checked: !hidden.includes(item.id),
  }));
  return [{ label: TOOLBAR_TEXT.items, items }];
};

const columnsEntries = (layout: ToolbarLayout, id: string): ContextMenuEntry[] => {
  const side = toolbarSideOf(layout, id);
  if (side !== 'left' && side !== 'right') return [];
  const current = toolbarColumnsOf(layout, id);
  const items = TOOLBAR_COLUMN_CHOICES.map((choice): ContextMenuCommand => ({
    command: TOOLBAR_COMMANDS.columns,
    label: choice.label,
    args: { id, columns: choice.value },
    kind: 'radio',
    checked: current === choice.value,
  }));
  return [{ label: TOOLBAR_TEXT.columns, items }];
};

const toolbarContextEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const id = typeof context.data === 'string' ? context.data : null;
  if (id === null) return [];
  const { layout, definitions } = useToolbarLayoutStore.getState();
  return [
    { command: TOOLBAR_COMMANDS.labels, args: id, checked: toolbarLabelsOn(layout, id) },
    ...itemsEntries(layout, definitions.find((def) => def.id === id)),
    ...columnsEntries(layout, id),
    { label: TOOLBAR_TEXT.moveTo, items: TOOLBAR_SIDE_ORDER.map((side) => moveEntry(layout, id, side)) },
    'separator',
    { command: TOOLBAR_COMMANDS.hide, args: id },
  ];
};

export { toolbarContextEntries };
