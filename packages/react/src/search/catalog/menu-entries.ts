/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { WIDGET_KEY_PREFIX } from '../../widgets/widget.constants';
import { normaliseKeywords } from '../normalise-keywords';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { SearchEntry, SearchKind } from '../search.type';

const widgetId = (key: string): string | null => (key.startsWith(WIDGET_KEY_PREFIX) ? key.slice(WIDGET_KEY_PREFIX.length) : null);

const idOf = (item: MenuItem): string => {
  if (item.screen) return `${SCREEN_ID_PREFIX}${item.screen}`;
  const widget = widgetId(item.key);
  return widget === null ? `menu:${item.key}` : `widget:${widget}`;
};

const kindOf = (item: MenuItem, trail: readonly string[]): SearchKind => {
  if (item.screen) return trail.length === 0 ? 'screen' : 'action';
  return widgetId(item.key) === null ? 'action' : 'widget';
};

const leafEntry = (item: MenuItem, trail: readonly string[], blocked: ReadonlySet<string>): SearchEntry | null => {
  const { label, icon, description, disabled, checked, screen, confirm, onCancel, onClick } = item;
  if (!screen && !onClick) return null;
  return {
    id: idOf(item),
    kind: kindOf(item, trail),
    label,
    icon,
    description,
    breadcrumb: [...trail],
    keywords: normaliseKeywords(trail),
    disabled: disabled === true || (screen !== undefined && blocked.has(screen)),
    checked,
    target: screen === undefined ? undefined : { route: screen },
    ...(confirm === undefined || onClick === undefined ? {} : { confirm, onCancel }),
    run: onClick,
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
