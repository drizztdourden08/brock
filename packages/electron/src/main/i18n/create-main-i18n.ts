/* @layer electron-main @kind logic */
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { MainLocales } from './main-locales.type';
import { brockMainLayer } from './brock-main-layer';

const createMainI18n = (locales?: MainLocales): I18n => {
  const loaders = locales?.loaders ?? {};
  return createI18n({
    base: locales?.base ?? 'en',
    layers: [brockMainLayer, ...(locales?.layers ?? [])],
    load: async (tag) => (await loaders[tag]?.()) ?? [],
  });
};

export { createMainI18n };
