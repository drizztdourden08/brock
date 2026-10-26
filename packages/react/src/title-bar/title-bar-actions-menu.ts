/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { useChordLookup } from '../commands/useChordLookup';
import { useCommandEnabled } from '../commands/useCommandEnabled';
import type { MenuEntry } from '../menu/menu.type';
import type { TitleBarActionSource } from '../modules/renderer-module.type';
import { actionsMenuId } from './actions-menu-id';
import type { TitleBarActionsMenu, TitleBarItemEntry } from './title-bar-item.type';
import { titleBarMenuEntry } from './title-bar-menu-entry';
import { toBarAction } from './to-bar-action';

const titleBarActionsMenu = (entries: readonly TitleBarItemEntry[], menu: TitleBarActionsMenu): TitleBarActionSource => {
  const id = actionsMenuId(menu);
  return (): WindowTitleBarAction | null => {
    const enabled = useCommandEnabled();
    const chords = useChordLookup();
    const items = entries.flatMap((entry): MenuEntry[] => {
      const spec = typeof entry.source === 'function' ? entry.source() : entry.source;
      const made = spec === null ? null : titleBarMenuEntry(entry.id, spec, { enabled, chords });
      return made === null ? [] : [made];
    });
    return items.length === 0 ? null : toBarAction(id, { kind: 'menu', label: menu.label, icon: menu.icon, items });
  };
};

export { titleBarActionsMenu };
