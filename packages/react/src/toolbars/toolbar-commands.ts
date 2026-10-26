/* @layer renderer-shell @kind logic */
import type { CommandContext, CommandDef } from '../commands/command.type';
import { isToolbarMoveArgs } from './is-toolbar-move-args';
import { toolbarLabelsOn } from './toolbar-labels-on';
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
    id: TOOLBAR_COMMANDS.moveTo,
    label: TOOLBAR_TEXT.moveTo,
    group: TOOLBAR_GROUP,
    run: (context) => {
      if (isToolbarMoveArgs(context?.args)) useToolbarLayoutStore.getState().moveToSide(context.args.id, context.args.side);
    },
  },
];

export { toolbarCommands };
