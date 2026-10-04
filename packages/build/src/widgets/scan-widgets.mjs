/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { META_EXPORT } from '../screens/screen-conventions.constants.mjs';
import { DEFAULT_EXPORT, FILE_HINT, FOLDER_HINT, WIDGET_ID, WIDGET_SUFFIX, WIDGETS_DIR } from './widget-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, source: string, hasMeta: boolean, hasDefault: boolean }} WidgetFile
 */

/** @param {string} rootDir @param {import('node:fs').Dirent} entry @returns {{ file?: WidgetFile, finding?: string }} */
const readEntry = (rootDir, entry) => {
  const path = `${WIDGETS_DIR}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${FOLDER_HINT}` };
  if (!entry.name.endsWith(WIDGET_SUFFIX)) return { finding: `${path}: not a widget file; ${FILE_HINT}` };
  const id = entry.name.slice(0, -WIDGET_SUFFIX.length);
  if (!WIDGET_ID.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  const source = readFileSync(join(rootDir, path), 'utf8');
  return { file: { id, path, source, hasMeta: META_EXPORT.test(source), hasDefault: DEFAULT_EXPORT.test(source) } };
};

/**
 * @param {string} rootDir the app root
 * @returns {{ files: WidgetFile[], findings: string[] }} files by id, and strays
 */
const scanWidgets = (rootDir) => {
  const dir = join(rootDir, WIDGETS_DIR);
  if (!existsSync(dir)) return { files: [], findings: [] };
  const read = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => readEntry(rootDir, entry));
  return { files: read.flatMap(({ file }) => (file ? [file] : [])), findings: read.flatMap(({ finding }) => (finding ? [finding] : [])) };
};

export { scanWidgets };
