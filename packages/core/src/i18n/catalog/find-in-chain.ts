/* @layer core @kind logic */
import type { Catalog, Hit } from './catalog.type';

const findInChain = (catalog: Catalog, chain: readonly string[], key: string): Hit | undefined => {
  for (const locale of chain) {
    const text = catalog.find(locale, key);
    if (text !== undefined) return { text, locale };
  }
  return undefined;
};

export { findInChain };
