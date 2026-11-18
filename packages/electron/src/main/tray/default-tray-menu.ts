/* @layer electron-main @kind logic */
import type { TrayMenuItem } from '@drizztdourden08/brock-core/product';
import { mainI18n } from '../i18n/main-i18n';

const defaultTrayMenu = (productName: string): TrayMenuItem[] => [
  { label: mainI18n().t('brock-main:tray.show', { name: productName }), action: 'show' },
  { type: 'separator' },
  { label: mainI18n().t('brock-main:tray.quit'), action: 'quit' },
];

export { defaultTrayMenu };
