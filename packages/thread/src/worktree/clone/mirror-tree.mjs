/* @layer tooling-scripts @kind logic */
import { copyFile, link, mkdir, readdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const LINK_TYPE = process.platform === 'win32' ? 'junction' : 'dir';

/**
 * @typedef {object} MirrorRules
 * @property {(target: string, rel: string) => string | null} mapLink where a link should point in the copy, null leaves it out
 * @property {(rel: string, isDir: boolean) => boolean} [skip] leaves out an entry, by its path relative to the source
 * @property {((rel: string) => ((text: string) => string) | null)} [rewrite] a text rewrite for a file, null hardlinks it
 */

const linkOrCopy = async (from, to, counts) => {
  try {
    await link(from, to);
    counts.linked += 1;
  } catch {
    await copyFile(from, to);
    counts.copied += 1;
  }
};

const placeFile = async (from, to, rewrite, counts) => {
  if (!rewrite) return linkOrCopy(from, to, counts);
  await writeFile(to, rewrite(await readFile(from, 'utf8')));
  counts.rewritten += 1;
  return undefined;
};

const placeLink = async ({ from, to, rel }, rules, counts) => {
  const target = rules.mapLink(resolve(dirname(from), await readlink(from)), rel);
  if (target === null) {
    counts.dropped += 1;
    return;
  }
  await symlink(target, to, LINK_TYPE);
  counts.links += 1;
};

const mirrorDir = async (paths, rules, counts) => {
  const { from, to, rel } = paths;
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  await Promise.all(entries.map((entry) => {
    const child = { from: join(from, entry.name), to: join(to, entry.name), rel: rel ? join(rel, entry.name) : entry.name };
    if (rules.skip?.(child.rel, entry.isDirectory())) return null;
    if (entry.isSymbolicLink()) return placeLink(child, rules, counts);
    if (entry.isDirectory()) return mirrorDir(child, rules, counts);
    return placeFile(child.from, child.to, rules.rewrite?.(child.rel) ?? null, counts);
  }));
};

/**
 * @param {string} from
 * @param {string} to
 * @param {MirrorRules} rules
 * @returns {Promise<{ linked: number, copied: number, rewritten: number, links: number, dropped: number }>} what it placed
 */
const mirrorTree = async (from, to, rules) => {
  const counts = { linked: 0, copied: 0, rewritten: 0, links: 0, dropped: 0 };
  await mirrorDir({ from, to, rel: '' }, rules, counts);
  return counts;
};

export { mirrorTree };
