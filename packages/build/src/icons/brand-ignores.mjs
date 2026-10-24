/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BRAND_IGNORES = [
  '**/build/icons/',
  '**/build/splash/',
  '**/public/logos/icon.svg',
  '**/public/logos/icon.ico',
  '**/public/logos/icon-256.png',
  '**/public/logos/icon-32.png',
  '**/public/logos/icon-24.png',
  '**/public/logos/icon-bot.svg',
  '**/public/logos/icon-bot.ico',
  '**/public/logos/icon-bot-256.png',
  '**/public/logos/mark.svg',
];

const bare = (line) => line.trim().replace(/^(?:\*\*\/|\/)/, '');

const BARE_IGNORES = new Set(BRAND_IGNORES.map(bare));

/**
 * @param {string} source a .gitignore
 * @param {boolean} brand true when an app sets icons.brand
 * @returns {string | null} the new source, or null when unchanged
 */
const reconcileBrandIgnores = (source, brand) => {
  const lines = source.split(/\r?\n/);
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  if (!brand) {
    const kept = lines.filter((line) => !BARE_IGNORES.has(bare(line)));
    return kept.length === lines.length ? null : kept.join(eol);
  }
  const present = new Set(lines.map(bare));
  const missing = BRAND_IGNORES.filter((line) => !present.has(bare(line)));
  if (!missing.length) return null;
  return `${source.replace(/\s*$/, '')}${eol}${missing.join(eol)}${eol}`;
};

/**
 * @param {string} repoRoot
 * @param {boolean} brand whether any app of the repo sets icons.brand
 * @returns {boolean} true when .gitignore was rewritten
 */
const syncBrandIgnores = (repoRoot, brand) => {
  const file = join(repoRoot, '.gitignore');
  if (!existsSync(file)) return false;
  const next = reconcileBrandIgnores(readFileSync(file, 'utf8'), brand);
  if (next === null) return false;
  writeFileSync(file, next, 'utf8');
  return true;
};

export { BRAND_IGNORES, reconcileBrandIgnores, syncBrandIgnores };
