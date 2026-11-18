/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { useI18n } from './useI18n';

const useText = (): ((text: Text) => string) => {
  const { i18n, locale } = useI18n();
  return useMemo(() => (text: Text) => i18n.text(text), [i18n, locale]);
};

export { useText };
