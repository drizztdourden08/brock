/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { UNKNOWN } from '../literal/literal.constants.mjs';
import { readExport } from '../literal/read-export.mjs';
import { entrySeeds } from './entry-seeds.mjs';
import { asRecord } from './settings-seeds.mjs';

const KEYWORDS = 'meta.keywords must be a literal list of strings, since the build reads it from the source without loading the page; a reference or a spread leaves the page out of search by keyword';
const ROWS = 'meta.searchRows must be a literal list of { label, keywords?, anchor? }, since the build reads it from the source without loading the page';

/** @param {unknown} value */
const isWords = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');

/** @param {Record<string, unknown>} meta @returns {string[]} */
const problemsOf = (meta) => [
  ...(meta.keywords !== undefined && !isWords(meta.keywords) ? [KEYWORDS] : []),
  ...(meta.searchRows !== undefined && (meta.searchRows === UNKNOWN || entrySeeds(meta.searchRows) === null) ? [ROWS] : []),
];

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile[]} files
 * @returns {string[]}
 */
const metaFindings = (rootDir, files) => files.filter((file) => file.hasMeta).flatMap((file) => {
  const meta = asRecord(readExport(readFileSync(join(rootDir, file.path), 'utf8'), 'meta'));
  return problemsOf(meta).map((problem) => `${file.path}: ${problem}`);
});

export { metaFindings };
