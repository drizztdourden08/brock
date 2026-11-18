/* @layer electron-main @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { MAIN_I18N_STATE } from './main-i18n.constants';

const installMainI18n = (i18n: I18n): void => {
  MAIN_I18N_STATE.current = i18n;
};

export { installMainI18n };
