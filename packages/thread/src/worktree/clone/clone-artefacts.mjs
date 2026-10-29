/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LONG_PATHS, tryGit } from '../../git.mjs';
import { APP_ARTEFACTS, KEYED_ARTEFACTS, ROOT_ARTEFACTS } from './artefacts.constants.mjs';

const posixJoin = (base, rel) => (base ? `${base}/${rel}` : rel);

const copyInto = (from, to) => {
  if (!existsSync(from) || existsSync(to)) return false;
  cpSync(from, to, { recursive: true, errorOnExist: false, force: false });
  return true;
};

/**
 * @param {string} source
 * @param {string} target
 * @param {string[]} scope folders relative to the root, '.' for all of it
 * @returns {boolean} true when the source's tracked files under scope equal the target's commit and nothing untracked sits there
 */
const treeMatches = (source, target, scope) => {
  const head = tryGit(['rev-parse', 'HEAD'], target);
  if (!head) return false;
  if (tryGit([...LONG_PATHS, 'diff', '--quiet', head, '--', ...scope], source) === null) return false;
  return tryGit([...LONG_PATHS, 'ls-files', '--others', '--exclude-standard', '--', ...scope], source) === '';
};

const ignoredIn = (source) => (tryGit([...LONG_PATHS, 'ls-files', '--others', '--ignored', '--exclude-standard', '--directory', '-z'], source) ?? '')
  .split('\0')
  .filter(Boolean)
  .map((entry) => entry.replace(/\/$/, ''));

const covers = (wanted) => (entry) => wanted.some((path) => entry === path || entry.startsWith(`${path}/`));

/**
 * Copies the generated files a launch would otherwise rebuild: content-keyed records always, other outputs only when the tree matches.
 * @param {{ source: string, target: string, appDirs: string[] }} input appDirs are the target's app folders
 * @returns {{ keyed: number, outputs: number, sameTree: boolean }} how many entries came over
 */
const cloneArtefacts = ({ source, target, appDirs }) => {
  const apps = [...new Set(appDirs.map((dir) => relative(target, dir).split('\\').join('/')))];
  let keyed = 0;
  for (const app of apps) for (const rel of KEYED_ARTEFACTS) if (copyInto(join(source, app, rel), join(target, app, rel))) keyed += 1;
  const sameTree = treeMatches(source, target, apps.map((app) => app || '.'));
  if (!sameTree) return { keyed, outputs: 0, sameTree };
  const wanted = [...ROOT_ARTEFACTS, ...apps.flatMap((app) => APP_ARTEFACTS.map((rel) => posixJoin(app, rel)))];
  const outputs = ignoredIn(source).filter(covers(wanted)).filter((entry) => copyInto(join(source, entry), join(target, entry))).length;
  return { keyed, outputs, sameTree };
};

export { cloneArtefacts };
