/* @layer core @kind logic */
import { cached } from './cached';

const pluralRules = (locale: string, ordinal: boolean): Intl.PluralRules =>
  cached('plural', locale, { ordinal }, () => new Intl.PluralRules(locale, { type: ordinal ? 'ordinal' : 'cardinal' }));

export { pluralRules };
