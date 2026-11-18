/* @layer core @kind logic */
import type { MessageValue } from '../message-values.type';

const toDate = (value: MessageValue): Date => (value instanceof Date ? value : new Date(value as string | number));

export { toDate };
