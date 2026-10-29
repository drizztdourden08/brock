/* @layer tooling-scripts @kind logic */
import { isAbsolute, relative, resolve } from 'node:path';

/**
 * @param {string} root
 * @param {string} path
 * @returns {boolean} true when path is root or sits under it
 */
const isInside = (root, path) => {
  const rel = relative(resolve(root), resolve(path));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

/**
 * @param {[string, string][]} pairs from and to folders, the most specific first
 * @returns {(path: string) => string} moves a path from one folder to the other
 */
const pathMapper = (pairs) => (path) => {
  const pair = pairs.find(([from]) => isInside(from, path));
  return pair ? resolve(pair[1], relative(resolve(pair[0]), resolve(path))) : path;
};

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cygdrive = (path) => path.replace(/^([A-Za-z]):/, (_, drive) => `/proc/cygdrive/${drive.toLowerCase()}`).split('\\').join('/');

/**
 * @param {string} path an absolute path
 * @returns {string[]} the spellings a pnpm shim or state file may use for it
 */
const spellings = (path) => {
  const win = resolve(path);
  const forms = new Set([win, win.split('\\').join('/')]);
  if (/^[A-Za-z]:/.test(win)) forms.add(cygdrive(win));
  return [...forms];
};

/**
 * @param {[string, string][]} pairs from and to folders, the most specific first
 * @returns {(text: string) => string} rewrites every spelling of each from folder in a text file
 */
const textRewriter = (pairs) => {
  const rules = pairs.flatMap(([from, to]) => {
    const targets = spellings(to);
    return spellings(from).map((form, index) => ({ form: form.toLowerCase(), to: targets[Math.min(index, targets.length - 1)] }));
  });
  if (rules.length === 0) return (text) => text;
  const pattern = new RegExp(`(?:${rules.map((rule) => escape(rule.form)).join('|')})(?![\\w.@+-])`, 'gi');
  return (text) => text.replace(pattern, (found) => rules.find((rule) => rule.form === found.toLowerCase())?.to ?? found);
};

export { isInside, pathMapper, textRewriter };
