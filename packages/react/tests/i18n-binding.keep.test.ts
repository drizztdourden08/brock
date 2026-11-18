/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { I18n, Layer } from '@drizztdourden08/brock-core/i18n';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { tesseraStringsOf } from '../src/i18n/tessera-strings-of';
import { useT } from '../src/i18n/useT';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const EN: Layer = { locale: 'en', namespace: 'app', messages: { hello: 'Hello' } };
const FR: Layer = { locale: 'fr', namespace: 'app', messages: { hello: 'Bonjour' } };
const TESSERA_FR: Layer = { locale: 'fr', namespace: 'tessera', messages: { 'common.cancel': 'Annuler', 'common.tryOf': 'Essai {attempt} sur {attempts}' } };
const KEY = 'app:hello' as Parameters<I18n['t']>[0];

let root: Root | null = null;

const Probe = () => createElement('p', null, useT()(KEY));

const mount = (i18n: I18n): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(I18nProvider, { i18n, children: createElement(Probe) })));
  return host;
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
});

describe('renderer i18n binding', { tags: ['critical'] }, () => {
  it('shows English with only the base layer', () => {
    const host = mount(createI18n({ base: 'en', layers: [EN] }));
    expect(host.textContent).toBe('Hello');
    expect(document.documentElement.lang).toBe('en');
  });

  it('switches a useT text to fr with no reload', async () => {
    const i18n = createI18n({ base: 'en', layers: [EN], load: () => Promise.resolve([FR, TESSERA_FR]) });
    const host = mount(i18n);
    await act(async () => i18n.setLocale('fr'));
    expect(host.textContent).toBe('Bonjour');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('translates the Tessera Cancel string and leaves English alone', async () => {
    const i18n = createI18n({ base: 'en', layers: [EN], load: () => Promise.resolve([FR, TESSERA_FR]) });
    expect(tesseraStringsOf(i18n)).toEqual({});
    await i18n.setLocale('fr');
    const strings = tesseraStringsOf(i18n) as Record<string, Record<string, string>>;
    expect(strings.common?.cancel).toBe('Annuler');
    expect(strings.dates?.locale).toBe('fr');
  });

  it('translates a function string with two params', async () => {
    const i18n = createI18n({ base: 'en', layers: [EN], load: () => Promise.resolve([FR, TESSERA_FR]) });
    await i18n.setLocale('fr');
    const tryOf = (tesseraStringsOf(i18n) as Record<string, Record<string, unknown>>).common?.tryOf;
    expect(typeof tryOf === 'function' ? tryOf('2', '5') : '').toBe('Essai 2 sur 5');
  });
});
