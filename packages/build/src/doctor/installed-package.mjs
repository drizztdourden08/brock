/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * @param {string} appDir
 * @param {string} name
 * @returns {{ version?: string, peerDependencies?: Record<string, string> } | null} the installed package.json, found by walking up from the app folder
 */
const readInstalled = (appDir, name) => {
  let current = appDir;
  for (;;) {
    const file = join(current, 'node_modules', name, 'package.json');
    if (existsSync(file)) {
      try {
        return JSON.parse(readFileSync(file, 'utf8'));
      } catch {
        return null;
      }
    }
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

export { readInstalled };
