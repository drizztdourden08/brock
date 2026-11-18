/* @layer electron-main @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { sendSplashTexts } from '../boot/send-splash-texts';
import { installEditMenu } from '../window/edit-menu';

const watchLocale = (i18n: I18n): (() => void) =>
  i18n.subscribe(() => {
    installEditMenu();
    sendSplashTexts();
  });

export { watchLocale };
