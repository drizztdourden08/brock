/* @layer core @kind logic */
import type { MessageValue } from '../message-values.type';
import { dateFormat } from '../intl-cache/date-format';
import { toDate } from './to-date';

const formatDateValue = (value: MessageValue, locale: string, options: Intl.DateTimeFormatOptions): string => {
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormat(locale, options).format(date);
};

export { formatDateValue };
