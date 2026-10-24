/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { SERVER_ENTRY, SERVER_LABEL, SERVER_SOURCE } from './server.constants.mjs';

const fail = (message) => {
  throw new Error(`${SERVER_LABEL}${message}`);
};

/**
 * @param {string} rootDir the app folder
 * @param {{ entry?: string } | undefined} server server of brock.config.ts
 * @returns {string} the absolute entry file
 */
const serverEntry = (rootDir, server) => {
  const entry = server?.entry ?? SERVER_ENTRY;
  if (typeof entry !== 'string' || !SERVER_SOURCE.test(entry)) fail('.entry names a .ts, .mts, .js or .mjs file, relative to the app folder.');
  if (isAbsolute(entry)) fail('.entry is an absolute path; give it relative to the app folder.');
  const full = resolve(rootDir, entry);
  if (relative(rootDir, full).startsWith('..')) fail('.entry leaves the app folder.');
  if (!existsSync(full)) fail(`: ${entry} does not exist. Write it, or set server.entry.`);
  return full;
};

export { serverEntry };
