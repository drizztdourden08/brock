/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const putFile = (root, path, content = '') => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

/**
 * @param {string} prefix the temp folder name prefix
 * @returns {{ tempDir: () => string, put: (root: string, path: string, content?: string) => void, cleanup: () => void }}
 */
const tempTree = (prefix) => {
  const made = [];
  const tempDir = () => made[made.push(mkdtempSync(join(tmpdir(), prefix))) - 1];
  const cleanup = () => made.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  return { tempDir, put: putFile, cleanup };
};

export { tempTree };
