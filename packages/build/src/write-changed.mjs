/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const lineFeeds = (text) => text.replace(/\r\n/g, '\n');

/**
 * @param {string} a
 * @param {string} b
 * @returns {boolean} true when both are the same text apart from CRLF against LF
 */
const sameText = (a, b) => lineFeeds(a) === lineFeeds(b);

/**
 * @param {string} target the file to write
 * @param {string} content the text, written with LF line endings
 * @returns {boolean} true when the file was written
 */
const writeIfChanged = (target, content) => {
  if (existsSync(target) && sameText(readFileSync(target, 'utf8'), content)) return false;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, lineFeeds(content), 'utf8');
  return true;
};

/**
 * @param {string} rootDir the app root
 * @param {{ path: string, content: string | null }[]} files null content removes the file
 * @returns {string[]} the paths written or removed
 */
const writeChanged = (rootDir, files) => files.flatMap(({ path, content }) => {
  const target = join(rootDir, path);
  if (content === null) {
    if (!existsSync(target)) return [];
    rmSync(target);
    return [path];
  }
  return writeIfChanged(target, content) ? [path] : [];
});

/**
 * @param {string} target a file another tool just wrote
 * @param {string | null} before the text before that tool ran, null when none
 * @returns {boolean} true when the file was put back or rewritten
 */
const settleLineEndings = (target, before) => {
  if (!existsSync(target)) return false;
  const after = readFileSync(target, 'utf8');
  const wanted = before !== null && sameText(before, after) ? before : lineFeeds(after);
  if (wanted === after) return false;
  writeFileSync(target, wanted, 'utf8');
  return true;
};

export { lineFeeds, sameText, settleLineEndings, writeChanged, writeIfChanged };
