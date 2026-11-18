/* @layer electron-main @kind logic */
import { Menu } from 'electron';
import type { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { editItem } from './edit-item';

const attachTextInteraction = (win: BrowserWindow): void => {
  win.webContents.on('context-menu', (_event, params) => {
    const hasSelection = params.selectionText.trim().length > 0;
    const template: MenuItemConstructorOptions[] = [];
    if (hasSelection) template.push(editItem('copy'));
    if (params.isEditable) {
      if (params.selectionText.length > 0) template.push(editItem('cut'));
      template.push(editItem('paste'));
    }
    if (hasSelection || params.isEditable) template.push({ type: 'separator' }, editItem('selectAll'));
    if (template.length === 0) return;
    Menu.buildFromTemplate(template).popup({ window: win });
  });

  win.webContents.on('before-input-event', (_event, input) => {
    if (input.type !== 'keyDown' || !(input.control || input.meta)) return;
    if (input.key.toLowerCase() === 'c') win.webContents.copy();
  });
};

export { attachTextInteraction };
