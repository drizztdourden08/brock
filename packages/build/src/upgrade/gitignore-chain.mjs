/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';

/**
 * @param {string} rootDir  The app folder
 * @returns {{ file: string, label: string, lines: string[], eol: string }[]}  The .gitignore files from the app up
 */
const gitignoreChain = (rootDir) => {
  const top = findWorkspaceRoot(rootDir) ?? rootDir;
  const dirs = [rootDir];
  while (dirs.at(-1) !== top && dirname(dirs.at(-1)) !== dirs.at(-1)) dirs.push(dirname(dirs.at(-1)));
  return dirs.map((dir) => join(dir, '.gitignore')).filter((file) => existsSync(file)).map((file) => {
    const source = readFileSync(file, 'utf8');
    return { file, label: relative(rootDir, file).replace(/\\/g, '/'), lines: source.split(/\r?\n/), eol: source.includes('\r\n') ? '\r\n' : '\n' };
  });
};

/**
 * @param {{ file: string, lines: string[], eol: string }} ignore
 * @param {number} after  The index the new lines follow
 * @param {string[]} added
 */
const insertLines = (ignore, after, added) => {
  const lines = [...ignore.lines];
  lines.splice(after + 1, 0, ...added);
  writeFileSync(ignore.file, lines.join(ignore.eol), 'utf8');
};

export { gitignoreChain, insertLines };
