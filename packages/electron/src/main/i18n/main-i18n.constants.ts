/* @layer electron-main @kind constants */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { createMainI18n } from './create-main-i18n';

const MAIN_I18N_STATE: { current: I18n } = { current: createMainI18n() };

export { MAIN_I18N_STATE };
