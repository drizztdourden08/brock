/* @layer core @kind logic */
import type { Catalog, Layer } from './catalog.type';
import type { Entry } from './create-catalog.type';
import { LAYER_RANK } from './layer-rank.constants';

const addLayer = (byLocale: Map<string, Map<string, Entry>>, layer: Layer): void => {
  const messages = byLocale.get(layer.locale) ?? new Map<string, Entry>();
  byLocale.set(layer.locale, messages);
  const rank = LAYER_RANK[layer.kind ?? 'package'];
  for (const [key, text] of Object.entries(layer.messages)) {
    const id = `${layer.namespace}:${key}`;
    const old = messages.get(id);
    if (!old || rank >= old.rank) messages.set(id, { text, rank });
  }
};

const createCatalog = (layers: readonly Layer[] = []): Catalog => {
  const byLocale = new Map<string, Map<string, Entry>>();
  const add = (list: readonly Layer[]): void => list.forEach((layer) => addLayer(byLocale, layer));
  add(layers);
  return {
    add,
    has: (tag) => byLocale.has(tag),
    find: (tag, key) => byLocale.get(tag)?.get(key)?.text,
  };
};

export { createCatalog };
