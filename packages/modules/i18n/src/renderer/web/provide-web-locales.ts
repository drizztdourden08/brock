/* @layer renderer-shell @kind logic */
import { WEB_LOCALES } from './web-locales.constants';

const provideWebLocales = (locales: { readonly base: string; readonly tags: readonly string[] }): void => {
  WEB_LOCALES.base = locales.base;
  WEB_LOCALES.tags = locales.tags;
};

export { provideWebLocales };
