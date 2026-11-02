/* @layer tooling-scripts @kind test */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const textOf = (content) => (typeof content === 'string' ? content : `${JSON.stringify(content)}\n`);

/**
 * @param {string} root the folder to fill
 * @param {Record<string, string | object>} files file path to text or JSON
 * @returns {string} the root
 */
const write = (root, files) => {
  Object.entries(files).forEach(([file, content]) => {
    const path = join(root, ...file.split('/'));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, textOf(content));
  });
  return root;
};

export { write };
