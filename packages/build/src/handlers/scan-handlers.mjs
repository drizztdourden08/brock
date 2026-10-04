/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { HANDLERS_DIR, HANDLERS_FILE, HANDLERS_SUFFIX } from './handlers.constants.mjs';

/**
 * @param {string} subject  The file name without -handlers.ts, kebab-case
 * @returns {string}  The export the file holds: engine -> engineHandlers
 */
const handlerExportOf = (subject) => `${subject.replace(/-(.)/g, (_, c) => c.toUpperCase())}Handlers`;

/**
 * @param {string} rootDir  The app root
 * @returns {{ subject: string, file: string, name: string }[]}  One per <subject>-handlers.ts, sorted
 */
const scanHandlers = (rootDir) => {
  const folder = join(rootDir, HANDLERS_DIR);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((file) => HANDLERS_FILE.test(file))
    .sort()
    .map((file) => {
      const subject = file.slice(0, -HANDLERS_SUFFIX.length);
      return { subject, file, name: handlerExportOf(subject) };
    });
};

export { scanHandlers };
