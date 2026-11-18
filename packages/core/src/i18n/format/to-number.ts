/* @layer core @kind logic */
import type { MessageValue } from '../message-values.type';

const toNumber = (value: MessageValue): number => (typeof value === 'number' ? value : Number(value));

export { toNumber };
