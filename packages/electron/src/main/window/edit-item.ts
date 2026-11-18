/* @layer electron-main @kind logic */
import type { MenuItemConstructorOptions } from 'electron';
import { mainI18n } from '../i18n/main-i18n';
import { EDIT_KEYS } from './edit-item.constants';

const editItem = (role: keyof typeof EDIT_KEYS): MenuItemConstructorOptions => ({ role, label: mainI18n().t(EDIT_KEYS[role]) });

export { editItem };
