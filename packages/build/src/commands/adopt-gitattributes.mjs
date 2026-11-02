/* @layer tooling-scripts @kind logic */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE = '.gitattributes';

const CONTENT = `* text=auto eol=lf
*.wasm binary
*.png binary
*.jpg binary
*.gif binary
*.ico binary
*.node binary
*.dll binary
`;

/**
 * @param {string} rootDir
 * @returns {boolean} true when the file was missing and is written now
 */
const ensureGitattributes = (rootDir) => {
  const file = join(rootDir, FILE);
  if (existsSync(file)) return false;
  writeFileSync(file, CONTENT, 'utf8');
  return true;
};

export { CONTENT, ensureGitattributes };
