/* @layer renderer-shell @kind logic */
import { useChordLookup } from '../commands/useChordLookup';
import { useCommandEnabled } from '../commands/useCommandEnabled';
import { useText } from '../i18n/useText';
import type { MenuEntry } from '../menu/menu.type';
import type { TitleBarActionSource } from '../modules/renderer-module.type';
import { actionsMenuId } from './actions-menu-id';
import type { TitleBarActionDef } from './title-bar-action.type';
import type { TitleBarActionsMenu, TitleBarItemEntry } from './title-bar-item.type';
import { titleBarMenuEntry } from './title-bar-menu-entry';
import { toBarAction } from './to-bar-action';

const titleBarActionsMenu = (entries: readonly TitleBarItemEntry[], menu: TitleBarActionsMenu): TitleBarActionSource => {
  const id = actionsMenuId(menu);
  return (): TitleBarActionDef | null => {
    const enabled = useCommandEnabled();
    const chords = useChordLookup();
    const text = useText();
    const items = entries.flatMap((entry): MenuEntry[] => {
      const spec = typeof entry.source === 'function' ? entry.source() : entry.source;
      const made = spec === null ? null : titleBarMenuEntry(entry.id, spec, { enabled, chords, text });
      return made === null ? [] : [made];
    });
    return items.length === 0 ? null : toBarAction(id, { kind: 'menu', label: menu.label, icon: menu.icon, items });
  };
};

export { titleBarActionsMenu };
