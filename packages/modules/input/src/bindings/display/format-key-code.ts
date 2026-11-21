/* @layer core @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { KEY_CODE_LABELS } from './display.constants';

const formatKeyCode = (code: string, text: (value: Text) => string): string => {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const label = KEY_CODE_LABELS[code];
  return label === undefined ? code : text(label);
};

export { formatKeyCode };
