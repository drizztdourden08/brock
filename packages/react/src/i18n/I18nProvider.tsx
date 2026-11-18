/* @layer renderer-shell @kind component */
import { useMemo, useSyncExternalStore } from 'react';
import type { I18nProviderProps } from './I18nProvider.type';
import { I18nContext } from './i18n-context';
import { useDocumentLocale } from './useDocumentLocale';

const I18nProvider = ({ i18n, children }: I18nProviderProps) => {
  const locale = useSyncExternalStore(i18n.subscribe, () => i18n.locale);
  const value = useMemo(() => ({ i18n, locale }), [i18n, locale]);
  useDocumentLocale(locale, i18n.dir);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export { I18nProvider };
