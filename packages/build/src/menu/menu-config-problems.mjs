/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { scanScreens } from '../screens/scan-screens.mjs';
import { SCREENS_CONFIG, SCREENS_DIR } from '../screens/screen-conventions.constants.mjs';
import { BUCKET_KEY_PREFIX, CARD_KINDS, MENU_CONFIG_PATH, MENU_FIELDS, PAGE_KINDS, SCREEN_KEY_PREFIX, VIEW_KEY, WINDOW_KEYS } from './menu-config.constants.mjs';

/** @param {unknown} value */
const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * @param {string} key
 * @param {unknown} raw
 * @returns {string[]}
 */
const shapeProblems = (key, raw) => {
  if (!isRecord(raw)) return [`${MENU_CONFIG_PATH}: entries["${key}"] must be an object of overrides`];
  return Object.entries(raw).flatMap(([field, value]) => {
    const rule = MENU_FIELDS[field];
    if (rule === undefined) return [`${MENU_CONFIG_PATH}: entries["${key}"] has an unknown field "${field}"`];
    if (value === undefined || rule.valid(value)) return [];
    return [`${MENU_CONFIG_PATH}: entries["${key}"].${field} must be ${rule.wants}`];
  });
};

/**
 * @param {string} rootDir
 * @returns {Set<string> | null}
 */
const screenKeys = (rootDir) => {
  if (!existsSync(join(rootDir, SCREENS_DIR, SCREENS_CONFIG))) return null;
  const { files, buckets } = scanScreens(rootDir);
  return new Set([
    ...buckets.map((bucket) => `${BUCKET_KEY_PREFIX}${bucket}`),
    ...files.filter((file) => file.bucket !== undefined && (PAGE_KINDS.includes(file.kind) || file.kind === 'tab'))
      .map((file) => `${BUCKET_KEY_PREFIX}${file.bucket}:${file.kind === 'tab' ? file.page : file.id}`),
    ...files.filter((file) => CARD_KINDS.includes(file.kind)).map((file) => `${SCREEN_KEY_PREFIX}${file.id}`),
  ]);
};

/**
 * @param {string} key
 * @param {Set<string> | null} keys
 */
const unknownScreenKey = (key, keys) => keys !== null && (key.startsWith(BUCKET_KEY_PREFIX) || key.startsWith(SCREEN_KEY_PREFIX)) && !keys.has(key);

/**
 * @param {string} key
 * @param {Record<string, unknown>} entry
 * @param {Set<string> | null} keys
 * @returns {string[]}
 */
const referenceProblems = (key, entry, keys) => {
  const problems = unknownScreenKey(key, keys) ? [`${MENU_CONFIG_PATH}: entries["${key}"] names no screen of src/screens`] : [];
  if (entry.before !== undefined && entry.after !== undefined) problems.push(`${MENU_CONFIG_PATH}: entries["${key}"] sets both before and after; before is used`);
  for (const field of ['before', 'after', 'parent']) {
    const target = entry[field];
    if (typeof target !== 'string') continue;
    if (target === key) problems.push(`${MENU_CONFIG_PATH}: entries["${key}"].${field} names the entry itself`);
    else if (unknownScreenKey(target, keys)) problems.push(`${MENU_CONFIG_PATH}: entries["${key}"].${field} "${target}" names no screen of src/screens`);
  }
  if (key === VIEW_KEY && entry.parent !== undefined) problems.push(`${MENU_CONFIG_PATH}: entries.view takes no parent; the View sub-menu sits at the top level of the menu`);
  return problems;
};

/** @param {unknown} entry */
const outOfMenu = (entry) => isRecord(entry) && (entry.hidden === true || entry.inMenu === false);

/**
 * @param {unknown} menu product.menu of brock.config.ts
 * @returns {string[]}
 */
const menuConfigWarnings = (menu) => {
  const entries = isRecord(menu) && isRecord(menu.entries) ? menu.entries : {};
  if (!outOfMenu(entries[VIEW_KEY]) || !WINDOW_KEYS.every((key) => outOfMenu(entries[key]))) return [];
  return [`${MENU_CONFIG_PATH}: entries.view, entries["${WINDOW_KEYS.join('"] and entries["')}"] are all out of the menu, so on a narrow window, where the title bar tucks its pin and full screen buttons away, nothing reaches them`];
};

/**
 * @param {Record<string, Record<string, unknown>>} entries
 * @returns {string[]}
 */
const loopProblems = (entries) => {
  const anchorOf = (key) => {
    const entry = entries[key];
    const anchor = entry?.before ?? entry?.after;
    return typeof anchor === 'string' ? anchor : undefined;
  };
  const reported = new Set();
  return Object.keys(entries).flatMap((start) => {
    const chain = [start];
    for (let next = anchorOf(start); next !== undefined && next !== start; next = anchorOf(next)) {
      if (chain.includes(next)) return [];
      chain.push(next);
    }
    if (anchorOf(start) === undefined || anchorOf(chain.at(-1) ?? start) !== start || chain.length < 2) return [];
    const id = [...chain].sort().join('|');
    if (reported.has(id)) return [];
    reported.add(id);
    return [`${MENU_CONFIG_PATH}: entries ${[...chain, start].join(' > ')} name each other in before and after, so none of them moves`];
  });
};

/**
 * @param {string} rootDir the app root
 * @param {unknown} menu product.menu of brock.config.ts
 * @returns {string[]}
 */
const menuConfigProblems = (rootDir, menu) => {
  if (menu === undefined) return [];
  const entries = isRecord(menu) ? menu.entries : undefined;
  if (!isRecord(menu) || (entries !== undefined && !isRecord(entries))) return [`${MENU_CONFIG_PATH}: must be { entries: { <key>: { ... } } }`];
  if (entries === undefined) return [];
  const keys = screenKeys(rootDir);
  const shaped = Object.entries(entries).flatMap(([key, raw]) => shapeProblems(key, raw));
  const valid = Object.fromEntries(Object.entries(entries).filter(([, raw]) => isRecord(raw)));
  return [...shaped, ...Object.entries(valid).flatMap(([key, entry]) => referenceProblems(key, entry, keys)), ...loopProblems(valid)];
};

export { menuConfigProblems, menuConfigWarnings };
