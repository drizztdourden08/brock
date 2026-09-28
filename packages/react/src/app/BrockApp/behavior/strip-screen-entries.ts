/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';

const stripItem = (item: MenuItem): MenuItem | null => {
  if (item.screen) return null;
  if (!item.children) return item;
  const children = stripScreenEntries(item.children);
  if (children.length === 0) return null;
  return { ...item, children };
};

const stripScreenEntries = (entries: readonly MenuEntry[]): MenuEntry[] => {
  const kept: MenuEntry[] = [];
  for (const entry of entries) {
    if (entry === 'separator') { kept.push(entry); continue; }
    const item = stripItem(entry);
    if (item) kept.push(item);
  }
  return tidySeparators(kept);
};

export { stripScreenEntries };
