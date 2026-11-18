/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { useI18n } from './useI18n';

const useT = (): I18n['t'] => {
  const { i18n, locale } = useI18n();
  return useMemo(() => ((key, ...args) => i18n.t(key, ...args)) as I18n['t'], [i18n, locale]);
};

export { useT };
