/* @layer renderer-shell @kind logic */
import type { MenuEntry } from './menu.type';
import { tidySeparators } from './tidy-separators';

const visibleMenu = (entries: readonly MenuEntry[]): MenuEntry[] =>
  tidySeparators(entries.flatMap((entry): MenuEntry[] => {
    if (entry === 'separator') return [entry];
    if (entry.hidden === true) return [];
    if (!entry.children) return [entry];
    const children = visibleMenu(entry.children);
    return children.length === 0 && entry.children.length > 0 ? [] : [{ ...entry, children }];
  }));

export { visibleMenu };
