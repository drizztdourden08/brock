/* @layer core @kind logic */
import type { Text } from '../i18n/text.type';

const plainText = (value: Text): string => (typeof value === 'string' ? value : value.key);

export { plainText };
