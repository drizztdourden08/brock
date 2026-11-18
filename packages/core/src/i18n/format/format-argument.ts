/* @layer core @kind logic */
import type { FormatKind } from '../parse/node.type';
import type { MessageValue } from '../message-values.type';
import { dateFormat, listFormat, numberFormat } from '../intl-cache';
import { DATE_STYLES, LIST_STYLES, NUMBER_STYLES, TIME_STYLES } from './format-styles.constants';
import { pick } from './pick-case';
import { toDate, toNumber } from './to-value';

type ArgumentFormatter = (value: MessageValue, locale: string, style: string | undefined) => string;

const formatDateValue = (value: MessageValue, locale: string, options: Intl.DateTimeFormatOptions): string => {
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormat(locale, options).format(date);
};

const FORMATTERS: Readonly<Record<FormatKind, ArgumentFormatter>> = {
  number: (value, locale, style) => numberFormat(locale, pick(NUMBER_STYLES, style ?? '')).format(toNumber(value)),
  date: (value, locale, style) => formatDateValue(value, locale, pick(DATE_STYLES, style ?? '') ?? DATE_STYLES.medium ?? {}),
  time: (value, locale, style) => formatDateValue(value, locale, pick(TIME_STYLES, style ?? '') ?? TIME_STYLES.medium ?? {}),
  list: (value, locale, style) => {
    const items = Array.isArray(value) ? (value as readonly string[]) : [];
    return listFormat(locale, pick(LIST_STYLES, style ?? '')).format(items);
  },
};

const formatArgument = (kind: FormatKind, value: MessageValue, locale: string, style: string | undefined): string =>
  FORMATTERS[kind](value, locale, style);

export { formatArgument };
