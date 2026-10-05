/* @layer renderer-shell @kind logic */
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from './menu.type';
import type { MenuResolver } from './to-menu-groups.type';
import { useMenuConfirmStore } from './useMenuConfirmStore';

const confirmPart = (item: MenuItem, resolve: MenuResolver): Partial<TesseraMenuItem> => {
  const { key, label, confirm, onClick } = item;
  if (confirm === undefined || resolve.armed === undefined) return {};
  const armed = resolve.armed === key;
  const run = (): void => {
    useMenuConfirmStore.getState().disarm();
    onClick?.();
  };
  return {
    label: armed ? confirm : label,
    kind: 'check',
    onSelect: armed ? run : () => useMenuConfirmStore.getState().arm(key),
  };
};

export { confirmPart };
