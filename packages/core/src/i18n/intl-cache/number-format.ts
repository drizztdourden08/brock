/* @layer core @kind logic */
import { cached } from './cached';

const numberFormat = (locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat =>
  cached('number', locale, options, () => new Intl.NumberFormat(locale, options));

export { numberFormat };
