/* @layer electron-main @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { MAIN_I18N_STATE } from './main-i18n.constants';

const mainI18n = (): I18n => MAIN_I18N_STATE.current;

export { mainI18n };
