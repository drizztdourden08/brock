/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import { formatBytes } from '../src/format';
import { createI18n, msg } from '../src/i18n';
import type { Layer } from '../src/i18n';

const EN: Layer = { locale: 'en', namespace: 'app', messages: { a: 'Hello', c: '{n, plural, one {# cat} other {# cats}}' } };

describe('I18n missing keys', { tags: ['critical'] }, () => {
  it('shows [[key]] in development and warns once per key and locale', () => {
    const onMissing = vi.fn();
    const i18n = createI18n({ base: 'en', dev: true, layers: [EN], onMissing });
    expect(i18n.t('app:nope')).toBe('[[app:nope]]');
    expect(i18n.t('app:nope')).toBe('[[app:nope]]');
    expect(onMissing).toHaveBeenCalledTimes(1);
    expect(onMissing).toHaveBeenCalledWith({ kind: 'missing', key: 'app:nope', locale: 'en' });
  });

  it('shows the key itself in a packaged build', () => {
    const i18n = createI18n({ base: 'en', layers: [EN] });
    expect(i18n.t('app:nope')).toBe('app:nope');
  });
});

describe('I18n layers and text', { tags: ['critical'] }, () => {
  it('lets the app layer override the package layer key by key', () => {
    const i18n = createI18n({
      base: 'en',
      layers: [
        { locale: 'en', namespace: 'app', kind: 'app', messages: { a: 'App' } },
        { locale: 'en', namespace: 'app', kind: 'package', messages: { a: 'Package', b: 'Package b' } },
      ],
    });
    expect(i18n.t('app:a')).toBe('App');
    expect(i18n.t('app:b')).toBe('Package b');
  });

  it('resolves a Text value and passes a string through', () => {
    const i18n = createI18n({ base: 'en', layers: [EN] });
    expect(i18n.text('plain')).toBe('plain');
    expect(i18n.text(msg('app:a'))).toBe('Hello');
    expect(i18n.text(msg('app:c', { n: 2 }))).toBe('2 cats');
    expect(JSON.parse(JSON.stringify(msg('app:c', { n: 2 })))).toEqual({ key: 'app:c', values: { n: 2 } });
  });
});

describe('I18n locale switching', { tags: ['critical'] }, () => {
  it('loads a locale once, swaps and notifies', async () => {
    const load = vi.fn((tag: string): Promise<readonly Layer[]> =>
      Promise.resolve([{ locale: tag, namespace: 'app', messages: { a: 'Bonjour' } }]));
    const i18n = createI18n({ base: 'en', layers: [EN], load });
    const listener = vi.fn();
    const stop = i18n.subscribe(listener);
    await i18n.setLocale('fr');
    expect(i18n.locale).toBe('fr');
    expect(i18n.t('app:a')).toBe('Bonjour');
    expect(listener).toHaveBeenCalledTimes(1);
    await i18n.setLocale('en');
    await i18n.setLocale('fr');
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith('fr');
    stop();
    await i18n.setLocale('en');
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('formats numbers and lists with the current locale', async () => {
    const i18n = createI18n({ base: 'en', layers: [EN] });
    expect(i18n.format.number(1234.5)).toBe('1,234.5');
    expect(i18n.format.list(['a', 'b'])).toBe('a and b');
  });
});

describe('formatBytes locale', { tags: ['critical'] }, () => {
  it('keeps its output with no locale and localizes with one', () => {
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048, { locale: 'fr' })).toContain('2,0');
  });
});
