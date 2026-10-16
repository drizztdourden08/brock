/* @layer renderer-shell @kind logic */
import type { MenuEntry } from './menu.type';

const routesIn = (entries: readonly MenuEntry[], all: boolean): string[] => entries.flatMap((entry) => {
  if (entry === 'separator') return [];
  const gone = all || entry.hidden === true;
  return [...(gone && entry.screen !== undefined ? [entry.screen] : []), ...routesIn(entry.children ?? [], gone)];
});

const hiddenMenuRoutes = (entries: readonly MenuEntry[]): Set<string> => new Set(routesIn(entries, false));

export { hiddenMenuRoutes };
