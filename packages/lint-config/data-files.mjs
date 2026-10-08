/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { closeSync, openSync, readSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DATA_HEADER_TEXT, DATA_SOURCE, HEADER_BYTES, SKIPPED_DIRS } from './data-kind.constants.mjs';

const fromGit = (rootDir) => {
  try {
    const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
      cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024,
    });
    return out.split('\0').filter(Boolean);
  } catch {
    return null;
  }
};

const walk = (rootDir, dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name.startsWith('.') || SKIPPED_DIRS.includes(entry.name)) return [];
  const path = join(dir, entry.name);
  return entry.isDirectory() ? walk(rootDir, path) : [relative(rootDir, path).replace(/\\/g, '/')];
});

const headOf = (file) => {
  let fd = null;
  try {
    fd = openSync(file, 'r');
    const buffer = Buffer.alloc(HEADER_BYTES);
    return buffer.toString('utf8', 0, readSync(fd, buffer, 0, HEADER_BYTES, 0));
  } catch {
    return '';
  } finally {
    if (fd !== null) closeSync(fd);
  }
};

/**
 * @param {string} rootDir the folder the ESLint config lints from
 * @returns {string[]} the files whose header says @kind data
 */
const dataFiles = (rootDir) => (fromGit(rootDir) ?? walk(rootDir, rootDir))
  .filter((file) => DATA_SOURCE.test(file))
  .filter((file) => DATA_HEADER_TEXT.test(headOf(join(rootDir, file))))
  .sort();

export { dataFiles };
