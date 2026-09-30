/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findWorkspaceRoot } from '../../workspace.mjs';
import { ONLY_BUILT_BLOCK } from './scaffold.constants.mjs';

/**
 * @param {string} rootDir the app root
 * @param {string} name a package whose install script pnpm should run
 * @returns {boolean} whether pnpm-workspace.yaml changed
 */
const allowBuiltDependency = (rootDir, name) => {
  const file = join(findWorkspaceRoot(rootDir) ?? rootDir, 'pnpm-workspace.yaml');
  if (!existsSync(file)) return false;
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const block = ONLY_BUILT_BLOCK.exec(text);
  if (block && new RegExp(`^[ \\t]+-\\s*['"]?${name}['"]?\\s*$`, 'm').test(block[1])) return false;
  const next = block
    ? text.replace(ONLY_BUILT_BLOCK, (all, items) => `onlyBuiltDependencies:\n${items.replace(/\n?$/, '\n')}  - ${name}\n`)
    : `${text.replace(/\n*$/, '\n')}\nonlyBuiltDependencies:\n  - ${name}\n`;
  writeFileSync(file, next, 'utf8');
  return true;
};

export { allowBuiltDependency };
