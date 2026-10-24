/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BRAND_PATHS = [
  'build/icons/',
  'build/filetypes/',
  'build/splash/',
  'public/logos/icon.svg',
  'public/logos/icon.ico',
  'public/logos/icon-256.png',
  'public/logos/icon-32.png',
  'public/logos/icon-24.png',
  'public/logos/icon-bot.svg',
  'public/logos/icon-bot.ico',
  'public/logos/icon-bot-256.png',
  'public/logos/mark.svg',
];

const START = '# brock sync: generated icon files, start. Brock rewrites the lines up to the end marker.';
const END = '# brock sync: generated icon files, end.';

const LEGACY = new Set(BRAND_PATHS.map((path) => `**/${path}`));

const linesFor = (appPaths) => appPaths.flatMap((app) => BRAND_PATHS.map((path) => (app ? `${app}/${path}` : `/${path}`)));

const withoutTrailingBlanks = (lines) => {
  const kept = [...lines];
  while (kept.length && kept.at(-1).trim() === '') kept.pop();
  return kept;
};

/**
 * @param {string} source a .gitignore
 * @param {string[]} appPaths the branded apps, '' for the root
 * @returns {string | null} the new source, or null when unchanged
 */
const reconcileBrandIgnores = (source, appPaths) => {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const lines = source.split(/\r?\n/);
  const block = appPaths.length ? [START, ...linesFor(appPaths), END] : [];
  const start = lines.indexOf(START);
  const end = start === -1 ? -1 : lines.indexOf(END, start);
  const old = end === -1 ? [] : lines.slice(start, end + 1);
  let next = lines.filter((line) => !LEGACY.has(line.trim()));
  if (start === -1 || end === -1) {
    next = next.filter((line) => line !== START);
    if (block.length) next = [...withoutTrailingBlanks(next), ...block, ''];
  } else {
    const at = next.indexOf(START);
    next.splice(at, old.length, ...block);
  }
  const changed = next.length !== lines.length || next.some((line, i) => line !== lines[i]);
  return changed ? next.join(eol) : null;
};

/**
 * @param {string} repoRoot
 * @param {string[]} appPaths the branded apps, '' for the root
 * @returns {boolean} true when .gitignore was rewritten
 */
const syncBrandIgnores = (repoRoot, appPaths) => {
  const file = join(repoRoot, '.gitignore');
  if (!existsSync(file)) return false;
  const next = reconcileBrandIgnores(readFileSync(file, 'utf8'), appPaths);
  if (next === null) return false;
  writeFileSync(file, next, 'utf8');
  return true;
};

export { START, END, reconcileBrandIgnores, syncBrandIgnores };
