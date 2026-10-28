/* @layer renderer-shell @kind logic */
import type { CommandContext, CommandDef } from '../commands/command.type';
import { layout } from '../widgets/layout-facade';
import { isToolbarColumnsArgs } from './is-toolbar-columns-args';
import { isToolbarItemArgs } from './is-toolbar-item-args';
import { isToolbarMoveArgs } from './is-toolbar-move-args';
import { toolbarLabelsOn } from './toolbar-labels-on';
import { toolbarToggledItems } from './toolbar-toggled-items';
import { TOOLBAR_COMMANDS, TOOLBAR_GROUP, TOOLBAR_TEXT } from './toolbar.constants';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const idOf = (context?: CommandContext): string | null => (typeof context?.args === 'string' ? context.args : null);

const toolbarCommands: readonly CommandDef[] = [
  {
    id: TOOLBAR_COMMANDS.hide,
    label: TOOLBAR_TEXT.hide,
    group: TOOLBAR_GROUP,
    run: (context) => {
      const id = idOf(context);
      if (id !== null) useToolbarLayoutStore.getState().hide(id);
    },
  },
  {
    id: TOOLBAR_COMMANDS.labels,
    label: TOOLBAR_TEXT.labels,
    group: TOOLBAR_GROUP,
    run: (context) => {
      const id = idOf(context);
      if (id !== null) useToolbarLayoutStore.getState().setLabels(id, !toolbarLabelsOn(useToolbarLayoutStore.getState().layout, id));
    },
  },
  {
    id: TOOLBAR_COMMANDS.focusMode,
    label: TOOLBAR_TEXT.focusMode,
    group: TOOLBAR_GROUP,
    run: (context) => {
      layout.focusMode(typeof context?.args === 'boolean' ? context.args : undefined);
    },
  },
  {
    id: TOOLBAR_COMMANDS.item,
    label: TOOLBAR_TEXT.showItem,
    group: TOOLBAR_GROUP,
    run: (context) => {
      if (!isToolbarItemArgs(context?.args)) return;
      const { id, item } = context.args;
      const store = useToolbarLayoutStore.getState();
      store.setItems(id, toolbarToggledItems(store.layout, id, item));
    },
  },
  {
    id: TOOLBAR_COMMANDS.columns,
    label: TOOLBAR_TEXT.columns,
    group: TOOLBAR_GROUP,
    run: (context) => {
      if (isToolbarColumnsArgs(context?.args)) useToolbarLayoutStore.getState().setColumns(context.args.id, context.args.columns);
    },
  },
  {
    id: TOOLBAR_COMMANDS.moveTo,
    label: TOOLBAR_TEXT.moveTo,
    group: TOOLBAR_GROUP,
    run: (context) => {
      if (isToolbarMoveArgs(context?.args)) useToolbarLayoutStore.getState().moveToSide(context.args.id, context.args.side);
    },
  },
];

export { toolbarCommands };
