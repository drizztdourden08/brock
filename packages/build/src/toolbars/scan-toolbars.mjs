/* @layer tooling-scripts @kind logic */
import { conventionReader } from '../convention-file-reader.mjs';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, LITERAL_ID, TOOLBAR_ID, TOOLBAR_SUFFIX, TOOLBARS_DIR } from './toolbar-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean, literalId: string | null }} ToolbarFile
 */

const readEntry = conventionReader({
  dir: TOOLBARS_DIR,
  suffix: TOOLBAR_SUFFIX,
  idPattern: TOOLBAR_ID,
  constantsFile: CONSTANTS_FILE,
  noun: 'toolbar',
  fileHint: FILE_HINT,
  folderHint: FOLDER_HINT,
  define: 'defineToolbar',
  shell: {},
  required: [],
  extra: (source) => ({ literalId: LITERAL_ID.exec(source)?.[1] ?? null }),
});

/**
 * @param {string} rootDir the app root
 * @returns {{ files: ToolbarFile[], findings: string[] }} toolbar files by id, and strays
 */
const scanToolbars = (rootDir) => scanFlatDir(rootDir, TOOLBARS_DIR, readEntry);

export { scanToolbars };
