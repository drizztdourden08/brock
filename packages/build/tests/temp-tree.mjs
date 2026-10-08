/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * @param {string} prefix the temp folder name prefix
 * @returns {{ tempDir: () => string, put: (root: string, path: string, content?: string) => void, cleanup: () => void }}
 */
const tempTree = (prefix) => {
  const made = [];
  return {
    tempDir: () => {
      const dir = mkdtempSync(join(tmpdir(), prefix));
      made.push(dir);
      return dir;
    },
    put: (root, path, content = '') => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    },
    cleanup: () => {
      for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
    },
  };
};

export { tempTree };
