/* @layer core @kind logic */
import type { MessageValue } from '../message-values.type';

const toText = (value: MessageValue): string => {
  if (value === null || value === undefined) return '';
  return Array.isArray(value) ? value.join(', ') : String(value);
};

export { toText };
