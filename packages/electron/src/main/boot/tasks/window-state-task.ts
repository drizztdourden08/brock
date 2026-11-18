/* @layer electron-main @kind logic */
import type { MainBootTask } from '../boot-state.type';
import { mainI18n } from '../../i18n/main-i18n';

const windowStateTask = (openWindow: () => Promise<void>): MainBootTask => ({
  id: 'window-state',
  label: mainI18n().t('brock-main:boot.window'),
  after: ['modules'],
  run: () => openWindow(),
});

export { windowStateTask };
