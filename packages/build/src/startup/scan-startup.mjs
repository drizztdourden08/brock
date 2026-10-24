/* @layer tooling-scripts @kind logic */
import { conventionReader } from '../convention-file-reader.mjs';
import { scanFlatDir } from '../scan-flat-dir.mjs';
import { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, PROMPT_ID, PROMPT_SHELL, PROMPT_SUFFIX, STARTUP_DIR } from './startup-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasDefault: boolean, shell: Record<string, unknown> | null }} PromptFile
 */

const readEntry = conventionReader({
  dir: STARTUP_DIR,
  suffix: PROMPT_SUFFIX,
  idPattern: PROMPT_ID,
  constantsFile: CONSTANTS_FILE,
  noun: 'start-up prompt',
  fileHint: FILE_HINT,
  folderHint: FOLDER_HINT,
  define: 'defineStartupPrompt',
  shell: PROMPT_SHELL,
  required: [],
});

/**
 * @param {string} rootDir the app root
 * @returns {{ files: PromptFile[], findings: string[] }} prompt files by id, and strays
 */
const scanStartup = (rootDir) => scanFlatDir(rootDir, STARTUP_DIR, readEntry);

export { scanStartup };
