/* @layer renderer-shell @kind logic */
import { menuIcon } from '../../../menu/menu-icon';
import type { SearchEntry } from '../../palette.type';
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
  run: entry.run,
});

export { toPaletteItem };
