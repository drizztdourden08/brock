/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { I18N_MODULE_ID } from '../i18n.constants';
import { registerI18nHandlers } from './handlers';
import { switchLanguage } from './switch-language';

const i18nMain: MainModule = {
  id: I18N_MODULE_ID,
  beforeReady: switchLanguage,
  register: (ctx) => {
    registerI18nHandlers(ctx);
  },
};

export default i18nMain;
export { i18nMain };
export type { I18nState } from '../i18n.type';
