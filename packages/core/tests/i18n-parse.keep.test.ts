/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createI18n } from '../src/i18n';
import type { MessageValues } from '../src/i18n';

const run = (message: string, values?: MessageValues): string =>
  createI18n({ base: 'en', layers: [{ locale: 'en', namespace: 'app', messages: { m: message } }] }).t('app:m', values);

describe('I18n message syntax', { tags: ['critical'] }, () => {
  it('selects on a value and falls to other', () => {
    const message = '{gender, select, female {She} male {He} other {They}} joined';
    expect(run(message, { gender: 'female' })).toBe('She joined');
    expect(run(message, { gender: 'robot' })).toBe('They joined');
    expect(run(message, { gender: 'constructor' })).toBe('They joined');
  });

  it('nests a plural inside a select', () => {
    const message =
      '{g, select, female {{n, plural, one {She has # cat} other {She has # cats}}} other {{n, plural, one {They have # cat} other {They have # cats}}}}';
    expect(run(message, { g: 'female', n: 2 })).toBe('She has 2 cats');
    expect(run(message, { g: 'x', n: 1 })).toBe('They have 1 cat');
  });

  it('drops rich tags to their content in t', () => {
    expect(run('Read the <link>guide</link> first')).toBe('Read the guide first');
  });

  it('hands tag content to the tag function in parts', () => {
    const i18n = createI18n({
      base: 'en',
      layers: [{ locale: 'en', namespace: 'app', messages: { m: 'Read the <link>guide for {name}</link> first' } }],
    });
    const parts = i18n.parts<string>('app:m', { name: 'Ann' }, { link: (chunks) => `[${chunks.join('')}]` });
    expect(parts).toEqual(['Read the ', '[guide for Ann]', ' first']);
  });

  it('follows ICU apostrophe quoting', () => {
    expect(run("It's {name}'s", { name: 'Ann' })).toBe("It's Ann's");
    expect(run("'{'name'}'", { name: 'Ann' })).toBe('{name}');
    expect(run("l''ecole")).toBe("l'ecole");
  });

  it('formats numbers and lists with Intl', () => {
    expect(run('{n, number}', { n: 1234.5 })).toBe('1,234.5');
    expect(run('{n, number, percent}', { n: 0.5 })).toBe('50%');
    expect(run('{names, list}', { names: ['a', 'b', 'c'] })).toBe('a, b, and c');
    expect(run('{names, list, or}', { names: ['a', 'b', 'c'] })).toBe('a, b, or c');
  });

  it('keeps a pound outside a plural and renders a missing value empty', () => {
    expect(run('# items')).toBe('# items');
    expect(run('Hello {name}')).toBe('Hello ');
  });

  it('shows the source text when a message does not parse', () => {
    expect(run('{unclosed')).toBe('{unclosed');
    expect(run('<b>open')).toBe('<b>open');
  });
});
