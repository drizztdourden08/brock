/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @template F
 * @param {string} rootDir the app root
 * @param {string} dir the convention folder, relative to the root
 * @param {(rootDir: string, entry: import('node:fs').Dirent) => { file?: F, finding?: string }} readEntry
 * @returns {{ files: F[], findings: string[] }} the files in name order, and what does not fit
 */
const scanFlatDir = (rootDir, dir, readEntry) => {
  const folder = join(rootDir, dir);
  if (!existsSync(folder)) return { files: [], findings: [] };
  const read = readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => readEntry(rootDir, entry));
  return { files: read.flatMap(({ file }) => (file ? [file] : [])), findings: read.flatMap(({ finding }) => (finding ? [finding] : [])) };
};

export { scanFlatDir };
