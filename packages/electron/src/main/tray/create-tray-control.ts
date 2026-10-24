/* @layer electron-main @kind logic */
import { Menu, Tray } from 'electron';
import type { ProductTray } from '@drizztdourden08/brock-core/product';
import type { TrayControl, TrayInput, TrayItemHandler } from './tray.type';
import { defaultTrayMenu } from './default-tray-menu';
import { trayMenuTemplate } from './tray-menu';
import { trayImage } from './tray-image';

const createTrayControl = ({ productName, icon, show, quit, log }: TrayInput): TrayControl => {
  const handlers = new Set<TrayItemHandler>();
  let current: Tray | null = null;

  const showWindow = (): void => {
    void show().catch((err: unknown) => log(`the tray could not show the window: ${String(err)}`, 'error'));
  };

  const pick: TrayItemHandler = (id) => {
    for (const handler of handlers) handler(id);
  };

  const clear = (): void => {
    if (current && !current.isDestroyed()) current.destroy();
    current = null;
  };

  const set = (spec: ProductTray): void => {
    const target = spec.icon ?? icon;
    const image = trayImage(target);
    if (image.isEmpty()) log(`the tray has no icon${target ? ` (${target} did not load)` : ''}`, 'warn');
    if (!current || current.isDestroyed()) {
      current = new Tray(image);
      current.on('click', showWindow);
    } else {
      current.setImage(image);
    }
    current.setToolTip(spec.tooltip);
    current.setContextMenu(Menu.buildFromTemplate(trayMenuTemplate(spec.menu ?? defaultTrayMenu(productName), { show: showWindow, quit, pick })));
  };

  return {
    set,
    clear,
    onItem: (handler) => {
      handlers.add(handler);
      return () => { handlers.delete(handler); };
    },
    get active() { return current !== null && !current.isDestroyed(); },
  };
};

export { createTrayControl };
