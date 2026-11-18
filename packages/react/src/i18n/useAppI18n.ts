/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import type { I18n, Layer } from '@drizztdourden08/brock-core/i18n';
import type { LocaleSource } from '../modules/renderer-module.type';
import type { AppLocales } from './i18n.type';
import { createAppI18n } from './create-app-i18n';
import { useLocaleSource } from './useLocaleSource';

const useAppI18n = (locales: AppLocales | undefined, layers: readonly Layer[], source: LocaleSource | undefined): I18n | null => {
  const [i18n] = useState(() => createAppI18n(locales, layers));
  const ready = useLocaleSource(i18n, source);
  return ready ? i18n : null;
};

export { useAppI18n };
