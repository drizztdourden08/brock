/* @layer renderer-shell @kind logic */
import type { MenuGroups } from '../../../menu/menu-config.type';
import type { MenuEntry } from '../../../menu/menu.type';

const collect = (entries: readonly MenuEntry[], into: Set<string>): void => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    into.add(entry.key);
    if (entry.children) collect(entry.children, into);
  }
};

const keysOf = (groups: MenuGroups): Set<string> => {
  const keys = new Set<string>();
  for (const entries of Object.values(groups)) collect(entries, keys);
  return keys;
};

export { keysOf };
