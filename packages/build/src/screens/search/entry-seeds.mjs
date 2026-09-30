/* @layer tooling-scripts @kind logic */
import { normaliseKeywords } from './normalise-keywords.mjs';
import { asRecord, text } from './settings-seeds.mjs';

/**
 * @param {unknown} value the searchEntries export of a custom page, read as a literal
 * @returns {{ label: string, keywords: string[], anchor?: string, description?: string }[] | null} null when it is not a literal list of { label }
 */
const entrySeeds = (value) => {
  if (!Array.isArray(value)) return null;
  const items = value.map(asRecord);
  if (items.some((item) => text(item.label) === undefined)) return null;
  return items.map((item) => ({
    label: String(item.label),
    keywords: normaliseKeywords(item.keywords),
    anchor: text(item.anchor),
    description: text(item.description),
  }));
};

export { entrySeeds };
