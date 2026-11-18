/* @layer electron-main @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { createMainI18n } from './create-main-i18n';

const state: { current: I18n } = { current: createMainI18n() };

const mainI18n = (): I18n => state.current;

const installMainI18n = (i18n: I18n): void => {
  state.current = i18n;
};

export { installMainI18n, mainI18n };
