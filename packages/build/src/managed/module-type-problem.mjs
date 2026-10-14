/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} rootDir the app root
 * @returns {string | null} why the managed configs would not load, or null
 */
const moduleTypeProblem = (rootDir) => {
  const file = join(rootDir, 'package.json');
  if (!existsSync(file)) return null;
  try {
    if (JSON.parse(readFileSync(file, 'utf8')).type === 'module') return null;
  } catch {
    return null;
  }
  return 'package.json has no "type": "module". The managed electron.vite.config.ts and vite.web.config.ts pass import.meta.dirname, which a CommonJS package leaves empty, so the build cannot find the app. Add "type": "module" (and rename any CommonJS .js file of the app to .cjs).';
};

export { moduleTypeProblem };
