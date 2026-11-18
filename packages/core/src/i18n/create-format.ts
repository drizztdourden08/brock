/* @layer core @kind logic */
import type { I18nFormat } from './i18n.type';
import { dateFormat } from './intl-cache/date-format';
import { listFormat } from './intl-cache/list-format';
import { numberFormat } from './intl-cache/number-format';

const createFormat = (locale: () => string): I18nFormat => ({
  number: (value, options) => numberFormat(locale(), options).format(value),
  date: (value, options) => dateFormat(locale(), options).format(value),
  list: (items, options) => listFormat(locale(), options).format(items),
});

export { createFormat };
