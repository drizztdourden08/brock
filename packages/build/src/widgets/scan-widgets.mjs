/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { META_EXPORT } from '../screens/screen-conventions.constants.mjs';
import { CONSTANTS_FILE, DEFAULT_EXPORT, FILE_HINT, FOLDER_HINT, KIT_SUFFIX, LAYOUT_FILE, OVERLAY_SUFFIX, WIDGET_ID, WIDGET_SUFFIX, WIDGETS_DIR } from './widget-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, source: string, hasMeta: boolean, hasDefault: boolean }} WidgetFile
 * @typedef {{ path: string, hasDefault: boolean }} LayoutFile
 * @typedef {'file' | 'kit' | 'overlay'} WidgetFileKind
 */

/** @type {readonly [WidgetFileKind, string][]} */
const KINDS = [['file', WIDGET_SUFFIX], ['kit', KIT_SUFFIX], ['overlay', OVERLAY_SUFFIX]];

/** @param {string} rootDir @param {string} path @param {string} id @returns {WidgetFile} */
const readFile = (rootDir, path, id) => {
  const source = readFileSync(join(rootDir, path), 'utf8');
  return { id, path, source, hasMeta: META_EXPORT.test(source), hasDefault: DEFAULT_EXPORT.test(source) };
};

/** @param {string} rootDir @param {import('node:fs').Dirent} entry @returns {{ file?: WidgetFile, kit?: WidgetFile, overlay?: WidgetFile, layout?: LayoutFile, finding?: string }} */
const readEntry = (rootDir, entry) => {
  const path = `${WIDGETS_DIR}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${FOLDER_HINT}` };
  if (CONSTANTS_FILE.test(entry.name)) return {};
  if (entry.name === LAYOUT_FILE) return { layout: { path, hasDefault: DEFAULT_EXPORT.test(readFileSync(join(rootDir, path), 'utf8')) } };
  const kind = KINDS.find(([, suffix]) => entry.name.endsWith(suffix));
  if (!kind) return { finding: `${path}: not a widget file; ${FILE_HINT}` };
  const id = entry.name.slice(0, -kind[1].length);
  if (!WIDGET_ID.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  return { [kind[0]]: readFile(rootDir, path, id) };
};

/** @param {Record<string, any>[]} read @param {string} key */
const listOf = (read, key) => read.flatMap((entry) => (entry[key] ? [entry[key]] : []));

/**
 * @param {string} rootDir the app root
 * @returns {{ files: WidgetFile[], kits: WidgetFile[], overlays: WidgetFile[], layout: LayoutFile | null, findings: string[] }} files by id, the layout file, and strays
 */
const scanWidgets = (rootDir) => {
  const dir = join(rootDir, WIDGETS_DIR);
  if (!existsSync(dir)) return { files: [], kits: [], overlays: [], layout: null, findings: [] };
  const read = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => readEntry(rootDir, entry));
  return {
    files: listOf(read, 'file'),
    kits: listOf(read, 'kit'),
    overlays: listOf(read, 'overlay'),
    layout: read.find((entry) => entry.layout)?.layout ?? null,
    findings: listOf(read, 'finding'),
  };
};

export { scanWidgets };
