/* @layer electron-main @kind logic */
import { MAIN_I18N_STATE } from './main-i18n.constants';

const offeredLocales = (): readonly string[] => MAIN_I18N_STATE.offered;

export { offeredLocales };
