/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { nav } from '../../navigation/nav';
import type { SearchEntry } from '../palette.type';

const leafEntry = (item: MenuItem, trail: readonly string[], blocked: ReadonlySet<string>): SearchEntry | null => {
  const { key, label, icon, description, disabled, checked, screen, onClick } = item;
  if (!screen && !onClick) return null;
  return {
    id: screen ? `screen:${screen}` : `menu:${key}`,
    kind: screen && trail.length === 0 ? 'screen' : 'action',
    label,
    icon,
    description,
    breadcrumb: [...trail],
    keywords: [...trail, label].join(' '),
    disabled: disabled === true || (screen !== undefined && blocked.has(screen)),
    checked,
    run: () => {
      if (screen) nav.open(screen);
      onClick?.();
    },
  };
};

const menuEntries = (menu: readonly MenuEntry[], blocked: ReadonlySet<string>, trail: readonly string[] = []): SearchEntry[] =>
  menu.flatMap((entry): SearchEntry[] => {
    if (entry === 'separator') return [];
    if (entry.children) return menuEntries(entry.children, blocked, [...trail, entry.label]);
    const leaf = leafEntry(entry, trail, blocked);
    return leaf ? [leaf] : [];
  });

export { menuEntries };
