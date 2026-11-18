/* @layer core @kind logic */
const cache = new Map<string, unknown>();

const cached = <T>(kind: string, locale: string, options: object | undefined, make: () => T): T => {
  const id = `${kind}|${locale}|${JSON.stringify(options ?? null)}`;
  const hit = cache.get(id) as T | undefined;
  if (hit) return hit;
  const created = make();
  cache.set(id, created);
  return created;
};

const numberFormat = (locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat =>
  cached('number', locale, options, () => new Intl.NumberFormat(locale, options));

const dateFormat = (locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat =>
  cached('date', locale, options, () => new Intl.DateTimeFormat(locale, options));

const listFormat = (locale: string, options?: Intl.ListFormatOptions): Intl.ListFormat =>
  cached('list', locale, options, () => new Intl.ListFormat(locale, options));

const pluralRules = (locale: string, ordinal: boolean): Intl.PluralRules =>
  cached('plural', locale, { ordinal }, () => new Intl.PluralRules(locale, { type: ordinal ? 'ordinal' : 'cardinal' }));

export { numberFormat, dateFormat, listFormat, pluralRules };
