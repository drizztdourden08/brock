/* @layer tooling-scripts @kind logic */
import { lstatSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const GONE = new Set(['ENOENT', 'ENOTDIR']);

/**
 * @param {string} path
 * @returns {import('node:fs').Stats | null} what sits at the path itself, null when nothing does
 */
const statOf = (path) => {
  try {
    return lstatSync(path);
  } catch (error) {
    if (GONE.has(error?.code)) return null;
    throw error;
  }
};

/**
 * @param {string} path a symlink or a junction, removed as a link
 * @returns {void}
 */
const removeLink = (path) => {
  try {
    rmdirSync(path);
  } catch {
    unlinkSync(path);
  }
  if (statOf(path)) throw new Error(`Could not remove the link ${path}. Nothing it points to was touched, and the delete stops here.`);
};

const mayHoldLinks = (entry) => entry.isSymbolicLink() || entry.isDirectory() || !entry.isFile();

const scan = (dir, found) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!mayHoldLinks(entry)) continue;
    const path = join(dir, entry.name);
    const stat = statOf(path);
    if (!stat) continue;
    if (stat.isSymbolicLink()) found.links.push(path);
    else if (stat.isDirectory() && entry.name === '.git') found.repos.push(dir);
    else if (stat.isDirectory()) scan(path, found);
  }
  return found;
};

/**
 * @param {string} root a real folder, never a link
 * @returns {number} how many links were removed
 */
const removeLinksFirst = (root) => {
  const found = scan(root, { links: [], repos: [] });
  if (found.repos.length > 0) throw new Error(`Refusing to delete ${root}: ${found.repos[0]} holds a .git folder, a repository of its own. Nothing was deleted.`);
  for (const link of found.links) removeLink(link);
  return found.links.length;
};

export { removeLink, removeLinksFirst, statOf };
