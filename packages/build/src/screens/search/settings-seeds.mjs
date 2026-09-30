/* @layer tooling-scripts @kind logic */
import { normaliseKeywords } from './normalise-keywords.mjs';

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (value !== null && typeof value === 'object' && !Array.isArray(value) ? /** @type {Record<string, unknown>} */ (value) : {});

/** @param {unknown} value @returns {string | undefined} */
const text = (value) => (typeof value === 'string' && value.trim() !== '' ? value : undefined);

/** @param {unknown} items */
const rowSeeds = (items) => (Array.isArray(items) ? items : []).map(asRecord).flatMap((item) => {
  const key = text(item.key);
  const label = text(item.label);
  if (key === undefined || label === undefined) return [];
  return [{ key, label, description: text(item.description), keywords: normaliseKeywords(item.keywords) }];
});

/** @param {Record<string, unknown>} section @param {string} title */
const subsectionSeeds = (section, title) => (Array.isArray(section.subsections) ? section.subsections : []).map(asRecord).flatMap((sub) => {
  const id = text(sub.id);
  return id === undefined ? [] : [{ id, title, sub: text(sub.title), rows: rowSeeds(sub.items) }];
});

/**
 * @param {unknown} value the default export of a .settings.ts file, read as a literal
 * @returns {{ id: string, title: string, sub?: string, rows: { key: string, label: string, description?: string, keywords: string[] }[] }[]}
 */
const settingsSeeds = (value) => (Array.isArray(value) ? value : []).map(asRecord).flatMap((section) => {
  const id = text(section.id);
  const title = text(section.title);
  if (id === undefined || title === undefined) return [];
  return Array.isArray(section.subsections) ? subsectionSeeds(section, title) : [{ id, title, rows: rowSeeds(section.items) }];
});

export { asRecord, settingsSeeds, text };
