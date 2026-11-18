/* @layer renderer-shell @kind hook */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { useT, useText } from '../i18n';

const useWidgetErrorLabel = (): ((label: Text) => string) => {
  const t = useT();
  const text = useText();
  return (label) => t('brock-app:widgets.error', { label: text(label) });
};

export { useWidgetErrorLabel };
