/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { META_EXPORT } from '../screens/screen-conventions.constants.mjs';
import { DEFAULT_EXPORT } from '../widgets/widget-conventions.constants.mjs';
import { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, ITEM_ID, ITEM_SUFFIX, ORDER_EXPORT, TITLE_BAR_DIR } from './title-bar-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean, hasOrder?: boolean, hasMeta?: boolean }} TitleBarFile
 */

/** @param {string} rootDir @param {import('node:fs').Dirent} entry @returns {{ file?: TitleBarFile, finding?: string }} */
const readEntry = (rootDir, entry) => {
  const path = `${TITLE_BAR_DIR}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${FOLDER_HINT}` };
  if (CONSTANTS_FILE.test(entry.name)) return {};
  if (!entry.name.endsWith(ITEM_SUFFIX)) return { finding: `${path}: not a title bar item file; ${FILE_HINT}` };
  const id = entry.name.slice(0, -ITEM_SUFFIX.length);
  if (!ITEM_ID.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  const source = readFileSync(join(rootDir, path), 'utf8');
  return { file: { id, path, hasDefault: DEFAULT_EXPORT.test(source), hasOrder: ORDER_EXPORT.test(source), hasMeta: META_EXPORT.test(source) } };
};

/**
 * @param {string} rootDir the app root
 * @returns {{ files: TitleBarFile[], findings: string[] }} item files by id, and strays
 */
const scanTitleBar = (rootDir) => scanFlatDir(rootDir, TITLE_BAR_DIR, readEntry);

export { scanTitleBar };
