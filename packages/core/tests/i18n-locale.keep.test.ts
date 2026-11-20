/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createI18n, fallbackChain, isMessageKey, negotiateLocale, textDirection } from '../src/i18n';
import type { MissingEvent } from '../src/i18n';

describe('I18n locales', { tags: ['critical'] }, () => {
  it('builds chains by dropping subtags', () => {
    expect(fallbackChain('fr-CA', ['en'])).toEqual(['fr-CA', 'fr', 'en']);
    expect(fallbackChain('zh-Hant-TW')).toEqual(['zh-Hant-TW', 'zh-Hant', 'zh']);
    expect(fallbackChain('fr-CA', ['fr', 'en'])).toEqual(['fr-CA', 'fr', 'en']);
  });

  it('resolves fr-CA through fr to en', () => {
    const events: MissingEvent[] = [];
    const i18n = createI18n({
      base: 'en',
      locale: 'fr-CA',
      onMissing: (event) => events.push(event),
      layers: [
        { locale: 'en', namespace: 'app', messages: { a: 'Hello', b: 'Email', c: 'Only en' } },
        { locale: 'fr', namespace: 'app', messages: { a: 'Bonjour', b: 'Courriel' } },
        { locale: 'fr-CA', namespace: 'app', messages: { b: 'Courriel (CA)' } },
      ],
    });
    expect(i18n.chain).toEqual(['fr-CA', 'fr', 'en']);
    expect(i18n.t('app:a')).toBe('Bonjour');
    expect(i18n.t('app:b')).toBe('Courriel (CA)');
    expect(i18n.t('app:c')).toBe('Only en');
    expect(events).toEqual([{ kind: 'fallback', key: 'app:c', locale: 'fr-CA', from: 'en' }]);
  });

  it('negotiates a requested list against the available tags', () => {
    expect(negotiateLocale(['fr-CA'], ['en', 'fr'], 'en')).toBe('fr');
    expect(negotiateLocale(['de', 'pt-BR'], ['pt', 'en'], 'en')).toBe('pt');
    expect(negotiateLocale(['fr'], ['fr-FR', 'en'], 'en')).toBe('fr-FR');
    expect(negotiateLocale(['ja'], ['en', 'fr'], 'en')).toBe('en');
  });

  it('reads the text direction', () => {
    expect(textDirection('ar')).toBe('rtl');
    expect(textDirection('fa-IR')).toBe('rtl');
    expect(textDirection('fr')).toBe('ltr');
  });

  it('builds the accented pseudo-locale from the base', () => {
    const i18n = createI18n({
      base: 'en',
      locale: 'en-XA',
      layers: [{ locale: 'en', namespace: 'app', messages: { save: 'Save', hi: 'Hi {name}' } }],
    });
    expect(i18n.t('app:save')).toBe('[Šávé~~]');
    expect(i18n.t('app:hi', { name: 'Ann' })).toBe('[Hî ~~Ann]');
  });

  it('builds the mirrored pseudo-locale and reports it as right to left', () => {
    const i18n = createI18n({
      base: 'en',
      locale: 'ar-XB',
      layers: [{ locale: 'en', namespace: 'app', messages: { save: 'Save' } }],
    });
    expect(i18n.dir).toBe('rtl');
    expect(i18n.t('app:save')).toBe('‫[~~evaS]‬');
  });
});

describe('isMessageKey', { tags: ['critical'] }, () => {
  it('takes a namespaced key read at run time and refuses plain text', () => {
    expect(isMessageKey('tessera:dialog.close')).toBe(true);
    expect(isMessageKey('brock-shell:tour.next')).toBe(true);
    expect(isMessageKey('Next step')).toBe(false);
    expect(isMessageKey(':missing-namespace')).toBe(false);
  });
});
