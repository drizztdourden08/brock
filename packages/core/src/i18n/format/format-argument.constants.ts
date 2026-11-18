/* @layer core @kind constants */
import type { FormatKind } from '../parse/node.type';
import type { ArgumentFormatter } from './format-argument.type';
import { listFormat } from '../intl-cache/list-format';
import { numberFormat } from '../intl-cache/number-format';
import { DATE_STYLES, LIST_STYLES, NUMBER_STYLES, TIME_STYLES } from './format-styles.constants';
import { formatDateValue } from './format-date-value';
import { pick } from './pick-case';
import { toNumber } from './to-number';

const FORMATTERS: Readonly<Record<FormatKind, ArgumentFormatter>> = {
  number: (value, locale, style) => numberFormat(locale, pick(NUMBER_STYLES, style ?? '')).format(toNumber(value)),
  date: (value, locale, style) => formatDateValue(value, locale, pick(DATE_STYLES, style ?? '') ?? DATE_STYLES.medium ?? {}),
  time: (value, locale, style) => formatDateValue(value, locale, pick(TIME_STYLES, style ?? '') ?? TIME_STYLES.medium ?? {}),
  list: (value, locale, style) => {
    const items = Array.isArray(value) ? (value as readonly string[]) : [];
    return listFormat(locale, pick(LIST_STYLES, style ?? '')).format(items);
  },
};

export { FORMATTERS };
