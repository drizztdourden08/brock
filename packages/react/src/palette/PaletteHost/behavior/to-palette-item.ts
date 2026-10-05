/* @layer renderer-shell @kind logic */
import { menuIcon } from '../../../menu/menu-icon';
import { activateEntry } from '../../../search/activate-entry';
import type { SearchEntry } from '../../../search/search.type';
import type { PaletteItem } from '../PaletteHost.type';

const toPaletteItem = (entry: SearchEntry): PaletteItem => ({
  id: entry.id,
  label: entry.label,
  icon: menuIcon(entry.icon),
  description: entry.description,
  breadcrumb: entry.breadcrumb,
  disabled: entry.disabled,
  checked: entry.checked,
  toggle: entry.toggle && { checked: entry.toggle.value, onChange: entry.toggle.flip },
  ...(entry.confirm === undefined ? {} : { confirm: entry.confirm }),
  run: () => activateEntry(entry),
});

export { toPaletteItem };
