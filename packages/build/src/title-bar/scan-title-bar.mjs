/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { DEFAULT_EXPORT } from '../widgets/widget-conventions.constants.mjs';
import { FILE_HINT, FOLDER_HINT, ITEM_ID, ITEM_SUFFIX, TITLE_BAR_DIR } from './title-bar-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean }} TitleBarFile
 */

/** @param {string} rootDir @param {import('node:fs').Dirent} entry @returns {{ file?: TitleBarFile, finding?: string }} */
const readEntry = (rootDir, entry) => {
  const path = `${TITLE_BAR_DIR}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${FOLDER_HINT}` };
  if (!entry.name.endsWith(ITEM_SUFFIX)) return { finding: `${path}: not a title bar item file; ${FILE_HINT}` };
  const id = entry.name.slice(0, -ITEM_SUFFIX.length);
  if (!ITEM_ID.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  return { file: { id, path, hasDefault: DEFAULT_EXPORT.test(readFileSync(join(rootDir, path), 'utf8')) } };
};

/**
 * @param {string} rootDir the app root
 * @returns {{ files: TitleBarFile[], findings: string[] }} item files by id, and strays
 */
const scanTitleBar = (rootDir) => scanFlatDir(rootDir, TITLE_BAR_DIR, readEntry);

export { scanTitleBar };
