/* @layer core @kind logic */
import type { ResolveDeps, Resolved } from './resolve-message.type';
import { findInChain } from './catalog/find-in-chain';
import { isPseudoLocale } from './locale/pseudo/is-pseudo-locale';
import { sameLanguage } from './locale/same-language';

const resolveMessage = (deps: ResolveDeps, key: string): Resolved => {
  const { locale, report } = deps;
  const hit = findInChain(deps.catalog, deps.chain, key);
  if (!hit) {
    report({ kind: 'missing', key, locale });
    return { text: deps.dev ? `[[${key}]]` : key, locale, literal: true };
  }
  const same = sameLanguage(hit.locale, locale);
  if (!same && !isPseudoLocale(locale)) report({ kind: 'fallback', key, locale, from: hit.locale });
  return { text: hit.text, locale: same ? locale : hit.locale, literal: false };
};

export { resolveMessage };
