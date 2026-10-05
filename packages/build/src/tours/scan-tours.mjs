/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { DEFAULT_EXPORT } from '../widgets/widget-conventions.constants.mjs';
import { FILE_HINT, FOLDER_HINT, LITERAL_ID, TOUR_ID, TOUR_SUFFIX, TOURS_DIR } from './tour-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean, literalId: string | null }} TourFile
 */

/** @param {string} rootDir @param {import('node:fs').Dirent} entry @returns {{ file?: TourFile, finding?: string }} */
const readEntry = (rootDir, entry) => {
  const path = `${TOURS_DIR}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${FOLDER_HINT}` };
  if (!entry.name.endsWith(TOUR_SUFFIX)) return { finding: `${path}: not a tour file; ${FILE_HINT}` };
  const id = entry.name.slice(0, -TOUR_SUFFIX.length);
  if (!TOUR_ID.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  const source = readFileSync(join(rootDir, path), 'utf8');
  return { file: { id, path, hasDefault: DEFAULT_EXPORT.test(source), literalId: LITERAL_ID.exec(source)?.[1] ?? null } };
};

/**
 * @param {string} rootDir the app root
 * @returns {{ files: TourFile[], findings: string[] }} tour files by id, and strays
 */
const scanTours = (rootDir) => scanFlatDir(rootDir, TOURS_DIR, readEntry);

export { scanTours };
