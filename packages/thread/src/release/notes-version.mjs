/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const NOTES_DIR = 'release-notes';
const NOTES_FILE = /^v(\d+)\.(\d+)\.(\d+)\.md$/;

const partsOf = (name) => name.match(NOTES_FILE).slice(1).map(Number);

const newerFirst = (a, b) => {
  const [x, y] = [partsOf(a), partsOf(b)];
  return y[0] - x[0] || y[1] - x[1] || y[2] - x[2];
};

/**
 * @param {string} rootDir
 * @returns {string | null} the highest version with notes, without the v
 */
const highestNotesVersion = (rootDir) => {
  const dir = join(rootDir, NOTES_DIR);
  if (!existsSync(dir)) return null;
  const [top] = readdirSync(dir).filter((name) => NOTES_FILE.test(name)).sort(newerFirst);
  return top ? top.replace(/^v|\.md$/g, '') : null;
};

/**
 * @param {string} rootDir
 * @param {string} tag
 * @returns {string} the notes path relative to the root
 */
const notesFileFor = (rootDir, tag) => {
  const rel = join(NOTES_DIR, `${tag}.md`);
  if (!existsSync(join(rootDir, rel))) throw new Error(`${rel} is missing. Write and commit the notes for ${tag} first; that file is the release body.`);
  return rel;
};

export { highestNotesVersion, notesFileFor };
