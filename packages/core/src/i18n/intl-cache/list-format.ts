/* @layer core @kind logic */
import { cached } from './cached';

const listFormat = (locale: string, options?: Intl.ListFormatOptions): Intl.ListFormat =>
  cached('list', locale, options, () => new Intl.ListFormat(locale, options));

export { listFormat };
