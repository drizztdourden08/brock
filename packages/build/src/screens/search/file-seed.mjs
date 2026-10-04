/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { UNKNOWN } from '../literal/literal.constants.mjs';
import { readDefaultResult } from '../literal/read-default-result.mjs';
import { readExport } from '../literal/read-export.mjs';
import { entrySeeds } from './entry-seeds.mjs';
import { normaliseKeywords } from './normalise-keywords.mjs';
import { asRecord, settingsSeeds, text } from './settings-seeds.mjs';

/** @param {unknown} value */
const kept = (value) => value !== undefined && !(Array.isArray(value) && value.length === 0);

/** @param {Record<string, unknown>} seed */
const compact = (seed) => Object.fromEntries(Object.entries(seed).filter(([, value]) => kept(value)));

/** @param {string} source */
const settingsValue = (source) => {
  const value = readExport(source, 'default');
  return value === UNKNOWN ? readDefaultResult(source) : value;
};

/** @param {string} source @param {import('../scan-screens.mjs').ScreenFile} file */
const contentOf = (source, file) => {
  if (file.kind === 'settings') return { sections: settingsSeeds(settingsValue(source)) };
  if (file.kind === 'custom' && file.hasSearchEntries) return { entries: entrySeeds(readExport(source, 'searchEntries')) ?? [] };
  return {};
};

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile} file
 * @returns {Record<string, unknown>} the search seed, read without running it
 */
const fileSeed = (rootDir, file) => {
  const source = readFileSync(join(rootDir, file.path), 'utf8');
  const meta = file.hasMeta ? asRecord(readExport(source, 'meta')) : {};
  return compact({
    kind: file.kind,
    id: file.id,
    bucket: file.bucket,
    group: file.group,
    page: file.page,
    title: text(meta.title),
    icon: text(meta.icon),
    path: file.kind === 'sub' ? text(meta.path) : undefined,
    keywords: normaliseKeywords(meta.keywords),
    devOnly: meta.devOnly === true ? true : undefined,
    ...contentOf(source, file),
  });
};

export { fileSeed };
