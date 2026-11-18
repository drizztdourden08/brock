/* @layer core @kind logic */
import type { State } from './create-i18n.type';
import type { Tags } from './format/env.type';
import type { I18n, I18nOptions, Listener, TagMap } from './i18n.type';
import type { MessageKey, ArgsOf, ValuesOf } from './message-key.type';
import type { MessageValues } from './message-values.type';
import type { Text } from './text.type';
import { adaptTags } from './adapt-tags';
import { createCatalog } from './catalog/create-catalog';
import { createFormat } from './create-format';
import { createReporter } from './create-reporter';
import { compiledFor } from './format/compiled-for';
import { fallbackChain } from './locale/fallback-chain';
import { isPseudoLocale } from './locale/pseudo/is-pseudo-locale';
import { textDirection } from './locale/text-direction';
import { loadChain } from './load-chain';
import { mergeParts } from './merge-parts';
import { resolveMessage } from './resolve-message';

const createI18n = (options: I18nOptions): I18n => {
  const { base, load, dev = false } = options;
  const catalog = createCatalog(options.layers);
  const report = createReporter(options.onMissing);
  const listeners = new Set<Listener>();
  const loader = { catalog, pending: new Map<string, Promise<void>>(), load };
  const chainOf = (tag: string): readonly string[] => fallbackChain(tag, [base, 'en']);
  const initial = options.locale ?? base;
  const state: State = { locale: initial, chain: chainOf(initial), dir: textDirection(initial) };
  let ticket = 0;

  const run = (key: string, values: MessageValues | undefined, tags?: Tags): readonly unknown[] => {
    const resolved = resolveMessage({ catalog, locale: state.locale, chain: state.chain, dev, report }, key);
    if (resolved.literal) return [resolved.text];
    const pseudo = isPseudoLocale(state.locale) ? state.locale : null;
    return compiledFor(resolved.text, pseudo)({ values: values ?? {}, locale: resolved.locale, tags });
  };

  const t = <K extends MessageKey>(key: K, ...args: ArgsOf<K>): string => run(key, args[0] as MessageValues | undefined).join('');
  const parts = <T, K extends MessageKey = MessageKey>(key: K, values: ValuesOf<K> | undefined, tags: TagMap<T>): (string | T)[] =>
    mergeParts<T>(run(key, values as MessageValues | undefined, adaptTags(tags)));
  const text = (value: Text): string => (typeof value === 'string' ? value : run(value.key, value.values).join(''));

  const setLocale = async (tag: string): Promise<void> => {
    ticket += 1;
    const mine = ticket;
    await loadChain(loader, chainOf(tag));
    if (mine !== ticket || tag === state.locale) return;
    Object.assign(state, { locale: tag, chain: chainOf(tag), dir: textDirection(tag) });
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };

  const api: I18n = {
    get locale() { return state.locale; },
    get chain() { return state.chain; },
    get dir() { return state.dir; },
    t, parts, text, setLocale, subscribe,
    format: createFormat(() => state.locale),
  };
  return api;
};

export { createI18n };
