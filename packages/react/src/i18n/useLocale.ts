/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { LocaleView } from './i18n.type';
import { useI18n } from './useI18n';

const useLocale = (): LocaleView => {
  const { i18n, locale } = useI18n();
  return useMemo(() => ({ locale, dir: i18n.dir, chain: i18n.chain, format: i18n.format, setLocale: i18n.setLocale }), [i18n, locale]);
};

export { useLocale };
