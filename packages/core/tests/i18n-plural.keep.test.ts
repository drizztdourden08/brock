/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createI18n } from '../src/i18n';

const make = (locale: string, message: string) =>
  createI18n({ base: 'en', locale, layers: [{ locale, namespace: 'app', messages: { m: message } }] });

describe('I18n plural rules', { tags: ['critical'] }, () => {
  it('uses the French one and other categories', () => {
    const i18n = make('fr', '{n, plural, one {# fichier} other {# fichiers}}');
    expect(i18n.t('app:m', { n: 0 })).toBe('0 fichier');
    expect(i18n.t('app:m', { n: 1 })).toBe('1 fichier');
    expect(i18n.t('app:m', { n: 2 })).toBe('2 fichiers');
  });

  it('uses all six Arabic categories', () => {
    const i18n = make('ar', '{n, plural, zero {z} one {o} two {t} few {f} many {m} other {x}}');
    const read = (n: number) => i18n.t('app:m', { n });
    expect([0, 1, 2, 5, 11, 100].map(read)).toEqual(['z', 'o', 't', 'f', 'm', 'x']);
  });

  it('uses the Polish one, few, many categories', () => {
    const i18n = make('pl', '{n, plural, one {# plik} few {# pliki} many {# plikow} other {# pliku}}');
    const read = (n: number) => i18n.t('app:m', { n });
    expect([1, 3, 5, 12, 22].map(read)).toEqual(['1 plik', '3 pliki', '5 plikow', '12 plikow', '22 pliki']);
  });

  it('prefers an exact match and formats the pound with the locale', () => {
    const i18n = make('en', '{n, plural, =0 {none} one {# item} other {# items}}');
    expect(i18n.t('app:m', { n: 0 })).toBe('none');
    expect(i18n.t('app:m', { n: 1500 })).toBe('1,500 items');
  });

  it('subtracts the offset before choosing the category', () => {
    const i18n = make('en', '{n, plural, offset:1 =0 {nobody} =1 {just you} one {you and # other} other {you and # others}}');
    expect(i18n.t('app:m', { n: 1 })).toBe('just you');
    expect(i18n.t('app:m', { n: 2 })).toBe('you and 1 other');
    expect(i18n.t('app:m', { n: 3 })).toBe('you and 2 others');
  });

  it('picks ordinal categories', () => {
    const i18n = make('en', '{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}');
    const read = (n: number) => i18n.t('app:m', { n });
    expect([1, 2, 3, 4, 11, 21].map(read)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '21st']);
  });
});
