/* @layer renderer-shell @kind logic */
import { CONTEXT_MENU_SEPARATOR } from './context-menu.constants';
import type { ContextMenuEntry } from './context-menu.type';

const commandIds = (entries: readonly ContextMenuEntry[]): string[] =>
  entries.flatMap((entry): string[] => {
    if (typeof entry === 'string') return entry === CONTEXT_MENU_SEPARATOR ? [] : [entry];
    if ('command' in entry) return [entry.command];
    return 'items' in entry ? commandIds(entry.items) : [];
  });

export { commandIds };
