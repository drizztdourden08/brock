/* @layer renderer-shell @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';
import { toMenuGroups } from '../../../menu/to-menu-groups';
import type { MenuResolver } from '../../../menu/to-menu-groups.type';
import { LAST_GROUP_ID, LAST_GROUP_KEYS } from '../TitleBar.constants';

const isLast = (entry: MenuEntry): boolean => entry !== 'separator' && LAST_GROUP_KEYS.includes(entry.key);

const titleBarGroups = (entries: readonly MenuEntry[], resolve: MenuResolver): MenuGroup[] => {
  let split = entries.length;
  while (split > 0 && isLast(entries[split - 1] ?? 'separator')) split -= 1;
  if (split === entries.length || split === 0) return toMenuGroups(entries, resolve);
  const [head] = toMenuGroups(tidySeparators(entries.slice(0, split)), resolve);
  const [tail] = toMenuGroups(entries.slice(split), resolve);
  return head && tail ? [head, { ...tail, id: LAST_GROUP_ID }] : toMenuGroups(entries, resolve);
};

export { titleBarGroups };
