/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuItem, MenuItemDef } from './menu.type';
import { resolveMenuEntries } from './resolve-menu-entries';

const resolveMenuItem = (def: MenuItemDef, text: (value: Text) => string): MenuItem => {
  const { label, description, children, ...rest } = def;
  return {
    ...rest,
    label: text(label),
    ...(description === undefined ? {} : { description: text(description) }),
    ...(children ? { children: resolveMenuEntries(children, [], { at: 0 }, text) } : {}),
  };
};

export { resolveMenuItem };
