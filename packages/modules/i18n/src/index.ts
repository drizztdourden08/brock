/* @layer core @kind barrel */
import './augment';

export { I18N_MODULE_ID, DEFAULT_BASE_LOCALE } from './i18n.constants';
export { buildState } from './preference/build-state';
export { cleanPreference } from './preference/clean-preference';
export type { I18nApi, I18nState, I18nStateListener } from './i18n.type';
export type { StateInput } from './preference/preference.type';
