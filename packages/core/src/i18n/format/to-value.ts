/* @layer core @kind logic */
import type { MessageValue } from '../message-values.type';

const toNumber = (value: MessageValue): number => (typeof value === 'number' ? value : Number(value));

const toDate = (value: MessageValue): Date => (value instanceof Date ? value : new Date(value as string | number));

const toText = (value: MessageValue): string => {
  if (value === null || value === undefined) return '';
  return Array.isArray(value) ? value.join(', ') : String(value);
};

export { toNumber, toDate, toText };
