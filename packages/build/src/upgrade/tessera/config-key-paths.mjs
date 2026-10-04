/* @layer tooling-scripts @kind logic */
import { findJsonPath } from './json-tree.mjs';

const WILDCARD = '*';

const keysAt = (root, path) => {
  const found = findJsonPath(root, path);
  return found?.node.kind === 'object' ? found.node.members.map((member) => member.key) : [];
};

const fillFirst = (path, key) => {
  const at = path.indexOf(WILDCARD);
  return at === -1 ? path : path.with(at, key);
};

const expandOne = (root, from, to) => {
  const at = from.indexOf(WILDCARD);
  if (at === -1) return findJsonPath(root, from) ? [{ from, to }] : [];
  return keysAt(root, from.slice(0, at)).flatMap((key) => expandOne(root, fillFirst(from, key), fillFirst(to, key)));
};

const sameList = (a, b) => a.length === b.length && a.every((item, i) => item === b[i]);

const parentOf = (path) => path.slice(0, -1);

const leafOf = (path) => path.at(-1);

const liftable = (move) => {
  const [from, to] = [parentOf(move.from), parentOf(move.to)];
  return from.length > 0 && from.length === to.length && leafOf(move.from) === leafOf(move.to) && sameList(parentOf(from), parentOf(to)) && !sameList(from, to);
};

const liftGroup = (root, group) => {
  const [first] = group;
  const from = parentOf(first.from);
  const to = parentOf(first.to);
  const covered = new Set(group.map((move) => leafOf(move.from)));
  const all = keysAt(root, from).every((key) => covered.has(key));
  return all && !findJsonPath(root, to) ? [{ from, to }] : group;
};

const liftOnce = (root, moves) => {
  const groups = new Map();
  for (const move of moves) {
    const id = liftable(move) ? JSON.stringify([parentOf(move.from), parentOf(move.to)]) : JSON.stringify([move.from]);
    groups.set(id, [...(groups.get(id) ?? []), move]);
  }
  return [...groups.values()].flatMap((group) => (liftable(group[0]) ? liftGroup(root, group) : group));
};

const lift = (root, moves) => {
  const next = liftOnce(root, moves);
  return next.length === moves.length ? next : lift(root, next);
};

/**
 * @param {Record<string, any>} root the parsed file
 * @param {Record<string, string>} map old dotted path to new; * is any one key
 * @returns {{ from: string[], to: string[] }[]} a parent moves whole when all its keys move alike
 */
const configKeyPaths = (root, map) => {
  const moves = Object.entries(map)
    .sort(([a], [b]) => b.length - a.length)
    .flatMap(([from, to]) => expandOne(root, from.split('.'), to.split('.')));
  return lift(root, moves);
};

export { configKeyPaths, leafOf, parentOf, sameList };
