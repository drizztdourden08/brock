/* @layer electron-main @kind logic */
import { Menu } from 'electron';
import type { BaseWindow, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import type { EditRole } from '@drizztdourden08/brock-core/ipc';
import { askWithin } from '../ipc/ask-within';
import { EDIT_ASK_TIMEOUT_MS, EDIT_ITEMS } from './edit-menu.constants';
import type { EditItem } from './edit-menu.type';
import { getMainWindow } from './get-main-window';

const isBrowserWindow = (win: BaseWindow | null | undefined): win is BrowserWindow => win !== null && win !== undefined && 'webContents' in win;

const runEdit = async (win: BaseWindow | null | undefined, role: EditRole): Promise<void> => {
  if (!isBrowserWindow(win) || win.isDestroyed()) return;
  const owned = await askWithin(EDIT_ASK_TIMEOUT_MS, win, 'command:runEdit', role).catch(() => false);
  if (!owned && !win.isDestroyed()) win.webContents[role]();
};

const itemOf = (item: EditItem | 'separator', mac: boolean): MenuItemConstructorOptions => {
  if (item === 'separator') return { type: 'separator' };
  return {
    label: item.label,
    accelerator: mac ? item.accelerator.mac : item.accelerator.other,
    click: (_menuItem, win) => void runEdit(win ?? getMainWindow(), item.role),
  };
};

const installEditMenu = (platform: NodeJS.Platform = process.platform): void => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: 'Edit', submenu: EDIT_ITEMS.map((item) => itemOf(item, platform === 'darwin')) }]));
};

export { installEditMenu };
