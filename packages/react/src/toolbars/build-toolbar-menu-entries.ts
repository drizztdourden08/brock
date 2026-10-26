/* @layer renderer-shell @kind logic */
import { isToolbarShown, toolbarMenuGroups } from '@drizztdourden08/tessera/composites';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { toolbarOptionsEntry } from './toolbar-options-entry';
import { RESET_TOOLBARS_ENTRY, TOOLBAR_KEY_PREFIX, TOOLBARS_MENU_ICON, TOOLBARS_MENU_KEY } from './toolbar.constants';
import type { ToolbarMenuInput } from './toolbar.type';

const buildToolbarMenuEntries = ({ definitions, layout, toggle, words, reset }: ToolbarMenuInput): MenuItem[] => {
  if (definitions.length === 0) return [];
  const checks: MenuEntry[] = toolbarMenuGroups(definitions, layout, toggle, { menu: words.menu, reset: words.reset })
    .flatMap((group) => group.items)
    .flatMap((node) => ('separator' in node ? [] : [{ key: `${TOOLBAR_KEY_PREFIX}${node.id}`, label: node.label, checked: node.checked, disabled: node.disabled, onClick: node.onSelect }]));
  const options: MenuEntry[] = definitions.filter((definition) => isToolbarShown(layout, definition.id)).map((definition) => toolbarOptionsEntry(definition, layout));
  return [{
    key: TOOLBARS_MENU_KEY,
    label: words.menu,
    icon: TOOLBARS_MENU_ICON,
    children: [...checks, 'separator', ...(options.length === 0 ? [] : [...options, 'separator' as const]), { ...RESET_TOOLBARS_ENTRY, label: words.reset, onClick: reset }],
  }];
};

export { buildToolbarMenuEntries };
