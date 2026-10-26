/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readExport } from '../literal/read-export.mjs';
import { entrySeeds } from './entry-seeds.mjs';
import { metaFindings } from './meta-findings.mjs';

const MISSING = 'a custom page exports searchEntries so search finds what it shows; add export { searchEntries } (an empty list is allowed)';
const UNREADABLE = 'searchEntries must be a literal list of { label, keywords?, anchor?, description? }, since the build reads it from the source without loading the page';

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile[]} files
 * @returns {string[]}
 */
const customFindings = (rootDir, files) => files.filter((file) => file.kind === 'custom').flatMap((file) => {
  if (!file.hasSearchEntries) return [`${file.path}: ${MISSING}`];
  const source = readFileSync(join(rootDir, file.path), 'utf8');
  return entrySeeds(readExport(source, 'searchEntries')) === null ? [`${file.path}: ${UNREADABLE}`] : [];
});

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile[]} files
 * @returns {string[]}
 */
const searchFindings = (rootDir, files) => [...customFindings(rootDir, files), ...metaFindings(rootDir, files)];

export { searchFindings };
