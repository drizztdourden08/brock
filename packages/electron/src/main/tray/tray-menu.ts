/* @layer electron-main @kind logic */
import type { MenuItemConstructorOptions } from 'electron';
import type { TrayMenuItem } from '@drizztdourden08/brock-core/product';
import type { TrayMenuActions } from './tray.type';
import { mainI18n } from '../i18n/main-i18n';

const templateOf = (item: TrayMenuItem, actions: TrayMenuActions): MenuItemConstructorOptions => {
  if ('type' in item) return { type: 'separator' };
  const label = mainI18n().text(item.label);
  if ('action' in item) return { label, click: item.action === 'show' ? actions.show : actions.quit };
  return { label, enabled: item.enabled ?? true, click: () => actions.pick(item.id) };
};

const trayMenuTemplate = (items: readonly TrayMenuItem[], actions: TrayMenuActions): MenuItemConstructorOptions[] =>
  items.map((item) => templateOf(item, actions));

export { trayMenuTemplate };
