/* @layer tooling-scripts @kind build */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { DEFAULT_DATA_DIR, EXPORT_FILES } from './apworld.constants.mjs';
import { callEntry } from './call-entry.mjs';

/**
 * @param {string} rootDir The app root
 * @param {{ entry?: string, fn?: string, data?: string }} options The command options
 * @returns {Promise<string>} one line saying what was written
 */
const exportApworld = async (rootDir, options) => {
  const files = await callEntry(rootDir, options, undefined);
  const missing = EXPORT_FILES.filter((name) => !(files && name in files));
  if (missing.length) throw new Error(`${options.fn} did not return ${missing.join(', ')}`);
  const dataDir = resolve(rootDir, options.data ?? DEFAULT_DATA_DIR);
  mkdirSync(dataDir, { recursive: true });
  for (const name of EXPORT_FILES) {
    const body = typeof files[name] === 'string' ? files[name] : `${JSON.stringify(files[name], null, 2)}\n`;
    writeFileSync(join(dataDir, name), body);
  }
  return `${relative(rootDir, dataDir) || '.'}: ${EXPORT_FILES.length} export files written`;
};

export { exportApworld };
