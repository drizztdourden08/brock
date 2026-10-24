/* @layer tooling-scripts @kind logic */
import { conventionReader } from '../convention-file-reader.mjs';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, LITERAL_ID, TOUR_ID, TOUR_SHELL, TOUR_SUFFIX, TOURS_DIR } from './tour-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean, literalId: string | null, shell: Record<string, unknown> | null }} TourFile
 */

const readEntry = conventionReader({
  dir: TOURS_DIR,
  suffix: TOUR_SUFFIX,
  idPattern: TOUR_ID,
  constantsFile: CONSTANTS_FILE,
  noun: 'tour',
  fileHint: FILE_HINT,
  folderHint: FOLDER_HINT,
  define: 'defineTour',
  shell: TOUR_SHELL,
  required: ['title'],
  extra: (source) => ({ literalId: LITERAL_ID.exec(source)?.[1] ?? null }),
});

/**
 * @param {string} rootDir the app root
 * @returns {{ files: TourFile[], findings: string[] }} tour files by id, and strays
 */
const scanTours = (rootDir) => scanFlatDir(rootDir, TOURS_DIR, readEntry);

export { scanTours };
