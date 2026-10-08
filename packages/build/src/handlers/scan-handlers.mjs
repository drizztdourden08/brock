/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { HANDLERS_DIR, HANDLERS_FILE } from './handlers.constants.mjs';

/**
 * @param {string} subject  The file name without -handlers.ts, kebab-case
 * @returns {string}  The export the file holds: engine -> engineHandlers
 */
const handlerExportOf = (subject) => `${subject.replace(/-(.)/g, (_, c) => c.toUpperCase())}Handlers`;

/**
 * @param {string} rootDir  The app root
 * @returns {{ subject: string, file: string, name: string, dev: boolean }[]}  One per handler file, sorted
 */
const scanHandlers = (rootDir) => {
  const folder = join(rootDir, HANDLERS_DIR);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .sort()
    .flatMap((file) => {
      const match = HANDLERS_FILE.exec(file);
      return match ? [{ subject: match[1], file, name: handlerExportOf(match[1]), dev: match[2] !== undefined }] : [];
    });
};

export { scanHandlers };
