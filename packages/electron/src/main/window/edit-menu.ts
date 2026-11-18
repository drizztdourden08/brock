/* @layer electron-main @kind logic */
import { Menu } from 'electron';
import { mainI18n } from '../i18n/main-i18n';
import { editItem } from './edit-item';
import { EDIT_MENU_KEY } from './edit-item.constants';

const installEditMenu = (): void => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: mainI18n().t(EDIT_MENU_KEY),
      submenu: [
        editItem('undo'),
        editItem('redo'),
        { type: 'separator' },
        editItem('cut'),
        editItem('copy'),
        editItem('paste'),
        editItem('selectAll'),
      ],
    },
  ]));
};

export { installEditMenu };
