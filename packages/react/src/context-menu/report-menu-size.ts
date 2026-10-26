/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import { CONTEXT_MENU_SEPARATOR, MAX_TOP_ENTRIES } from './context-menu.constants';
import type { ContextMenuEntry } from './context-menu.type';

const reported = new Set<string>();

const reportMenuSize = (zone: string, entries: readonly ContextMenuEntry[]): void => {
  if (!import.meta.env.DEV || reported.has(zone)) return;
  const count = entries.filter((entry) => entry !== CONTEXT_MENU_SEPARATOR).length;
  if (count <= MAX_TOP_ENTRIES) return;
  reported.add(zone);
  getAppLog().log('app', `Context menu ${zone}: ${count} top level entries, more than ${MAX_TOP_ENTRIES}. Group them in sub-menus.`, 'warn');
};

export { reportMenuSize };
