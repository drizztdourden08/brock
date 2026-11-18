/* @layer renderer-shell @kind logic */
import type { MessageKey, Text } from '@drizztdourden08/brock-core/i18n';
import type { TourShellText } from './tour.type';

const shellText = (value: TourShellText): Text =>
  (typeof value === 'string' || !('key' in value) ? value : { key: value.key as MessageKey });

export { shellText };
