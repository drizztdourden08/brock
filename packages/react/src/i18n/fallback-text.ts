/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { FALLBACK_I18N } from './i18n-context.constants';

const fallbackText = (value: Text): string => FALLBACK_I18N.text(value);

export { fallbackText };
