/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const writeInto = (dir) => ([path, content]) => {
  const target = join(dir, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
};

/**
 * @param {string} prefix the temporary folder prefix
 * @returns {{ appDir: (files: Record<string, string>) => string, cleanUp: () => void }} app folders with a brock.config.ts, and their removal
 */
const appDirs = (prefix) => {
  const made = new Set();
  const appDir = (files) => {
    const dir = mkdtempSync(join(tmpdir(), prefix));
    made.add(dir);
    Object.entries({ 'brock.config.ts': 'export default {};\n', ...files }).forEach(writeInto(dir));
    return dir;
  };
  const cleanUp = () => {
    made.forEach((dir) => rmSync(dir, { recursive: true, force: true }));
    made.clear();
  };
  return { appDir, cleanUp };
};

export { appDirs };
