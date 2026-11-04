/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, isAbsolute, join, relative } from 'node:path';
import { GENERATED_AT_LAUNCH, GENERATED_DIR } from './build-reuse.constants.mjs';

const GIT_OPTIONS = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 };
const GONE = 'gone';
const MANIFEST = 'package.json';

const gitOut = (args, cwd) => {
  try {
    return execFileSync('git', ['-c', 'core.quotepath=off', ...args], { windowsHide: true, ...GIT_OPTIONS, cwd });
  } catch {
    return null;
  }
};

const indexOf = (listing) => {
  const index = new Map();
  for (const record of listing.split('\0')) {
    const tab = record.indexOf('\t');
    if (tab > 0) index.set(record.slice(tab + 1), `b:${record.split(' ')[1]}`);
  }
  return index;
};

const statusOf = (listing) => {
  const status = new Map();
  for (const record of listing.split('\0')) if (record.length > 3) status.set(record.slice(3), record.slice(0, 2));
  return status;
};

const contentKey = (file) => {
  try {
    return `h:${createHash('sha256').update(readFileSync(file)).digest('hex')}`;
  } catch {
    return GONE;
  }
};

const dirOf = (rel) => (rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '');

const generatedAtLaunch = (rel) => GENERATED_AT_LAUNCH.includes(basename(rel)) && basename(dirOf(rel)) === GENERATED_DIR;

const namesByDir =(paths) => {
  const dirs = new Map();
  for (const rel of paths) {
    const dir = dirOf(rel);
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir).push(rel.slice(dir ? dir.length + 1 : 0));
  }
  return dirs;
};

/**
 * @typedef {object} RepoSnapshot
 * @property {string} top the repository root
 * @property {(file: string) => string | null} relOf a file relative to the root with / separators
 * @property {(rel: string) => string} keyOf the blob id of a clean tracked file
 * @property {(rel: string) => string} dirKeyOf a hash of the file names in a folder
 * @property {(rel: string) => string | null} manifestOf the nearest package.json at or above a folder
 */

/**
 * @param {string} dir a folder inside the repository
 * @returns {RepoSnapshot | null} null outside git
 */
const repoSnapshot = (dir) => {
  const top = gitOut(['rev-parse', '--show-toplevel'], dir)?.trim();
  const listing = top ? gitOut(['ls-files', '-s', '-z'], top) : null;
  const changes = listing === null ? null : gitOut(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--no-renames'], top);
  if (!top || listing === null || changes === null) return null;
  const index = indexOf(listing);
  const status = statusOf(changes);
  const hashed = new Map();
  const dirs = namesByDir(new Set([...index.keys(), ...[...status].filter(([rel, code]) => code === '??' && !generatedAtLaunch(rel)).map(([rel]) => rel)]));
  const keyOf = (rel) => {
    if (!status.has(rel) && index.has(rel)) return index.get(rel);
    if (!hashed.has(rel)) hashed.set(rel, contentKey(join(top, rel)));
    return hashed.get(rel);
  };
  const relOf = (file) => {
    const rel = relative(top, file);
    return rel && !rel.startsWith('..') && !isAbsolute(rel) ? rel.split('\\').join('/') : null;
  };
  const dirKeyOf = (rel) => createHash('sha256').update((dirs.get(rel) ?? []).sort().join('\n')).digest('hex').slice(0, 16);
  const manifestOf = (rel) => {
    for (let at = rel; ; at = dirOf(at)) {
      if (dirs.get(at)?.includes(MANIFEST)) return at ? `${at}/${MANIFEST}` : MANIFEST;
      if (!at) return null;
    }
  };
  return { top, relOf, keyOf, dirKeyOf, manifestOf };
};

export { repoSnapshot };
