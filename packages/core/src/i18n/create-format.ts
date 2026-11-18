/* @layer core @kind logic */
import type { I18nFormat } from './i18n.type';
import { dateFormat, listFormat, numberFormat } from './intl-cache';

const createFormat = (locale: () => string): I18nFormat => ({
  number: (value, options) => numberFormat(locale(), options).format(value),
  date: (value, options) => dateFormat(locale(), options).format(value),
  list: (items, options) => listFormat(locale(), options).format(items),
});

export { createFormat };
