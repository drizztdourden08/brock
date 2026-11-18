/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { I18N_MODULE_ID } from '../i18n.constants';
import { createLocaleSource } from './create-locale-source';
import { i18nLayer } from './i18n-layer';
import { LanguageProvider } from './LanguageProvider';
import { languageTab } from './language-tab/language-tab';

const localeSource = createLocaleSource();

const i18nRenderer: RendererModule = {
  id: I18N_MODULE_ID,
  i18n: localeSource,
  messages: [i18nLayer],
  settingsTabs: [languageTab(localeSource)],
  Provider: LanguageProvider,
};

export default i18nRenderer;
export { i18nRenderer, localeSource, LanguageProvider };
export { i18nApi } from './i18n-api';
export { provideWebLocales } from './web/provide-web-locales';
export type { I18nApi, I18nState } from '../i18n.type';
