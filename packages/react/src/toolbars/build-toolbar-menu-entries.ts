/* @layer renderer-shell @kind logic */
import { toolbarMenuGroups } from '@drizztdourden08/tessera/composites';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { RESET_TOOLBARS_ENTRY, TOOLBAR_KEY_PREFIX, TOOLBARS_MENU_ICON, TOOLBARS_MENU_KEY } from './toolbar.constants';
import type { ToolbarMenuInput } from './toolbar.type';

const buildToolbarMenuEntries = ({ definitions, layout, toggle, words, reset }: ToolbarMenuInput): MenuItem[] => {
  if (definitions.length === 0) return [];
  const checks: MenuEntry[] = toolbarMenuGroups(definitions, layout, toggle, { menu: words.menu, reset: words.reset })
    .flatMap((group) => group.items)
    .flatMap((node) => ('separator' in node ? [] : [{ key: `${TOOLBAR_KEY_PREFIX}${node.id}`, label: node.label, checked: node.checked, disabled: node.disabled, onClick: node.onSelect }]));
  return [{
    key: TOOLBARS_MENU_KEY,
    label: words.menu,
    icon: TOOLBARS_MENU_ICON,
    children: [...checks, 'separator', { ...RESET_TOOLBARS_ENTRY, label: words.reset, onClick: reset }],
  }];
};

export { buildToolbarMenuEntries };
