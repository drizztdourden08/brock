/* @layer core @kind logic */
import { cached } from './cached';

const dateFormat = (locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat =>
  cached('date', locale, options, () => new Intl.DateTimeFormat(locale, options));

export { dateFormat };
