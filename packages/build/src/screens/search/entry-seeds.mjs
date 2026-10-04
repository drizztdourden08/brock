/* @layer tooling-scripts @kind logic */
import { normaliseKeywords } from './normalise-keywords.mjs';
import { asRecord, text } from './settings-seeds.mjs';

/**
 * @param {unknown} value the searchEntries export of a custom page, read as a literal
 * @returns {{ label: string, keywords: string[], id?: string, anchor?: string, description?: string, params?: Record<string, unknown> }[] | null} null when it is not a literal list of { label }
 */
const entrySeeds = (value) => {
  if (!Array.isArray(value)) return null;
  const items = value.map(asRecord);
  if (items.some((item) => text(item.label) === undefined)) return null;
  return items.map((item) => {
    const params = asRecord(item.params);
    return {
      label: String(item.label),
      keywords: normaliseKeywords(item.keywords),
      id: text(item.id),
      anchor: text(item.anchor),
      description: text(item.description),
      ...(Object.keys(params).length > 0 ? { params } : {}),
    };
  });
};

export { entrySeeds };
