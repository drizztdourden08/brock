/* @layer renderer-shell @kind logic */
import { isMessageKey, type Text } from '@drizztdourden08/brock-core/i18n';
import type { TourShellText } from './tour.type';

const shellText = (value: TourShellText): Text => {
  if (typeof value === 'string' || !('key' in value)) return value;
  return isMessageKey(value.key) ? { key: value.key } : value.key;
};

export { shellText };
