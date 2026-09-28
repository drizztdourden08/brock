/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const stemOf = (file) => file.slice(0, -extname(file).length);

const preference = (file, { assetsDir, assetExtension }) => {
  if (existsSync(join(assetsDir, `${stemOf(file)}${assetExtension}`))) return 0;
  if (/\(USA\)/i.test(file)) return 1;
  return 2;
};

/**
 * @param {string} dir
 * @param {{ extensions: string[], assetExtension: string }} roms
 * @param {string} assetsDir where an extracted blob would already be
 * @returns {string | null} the preferred ROM path
 */
const findRom = (dir, roms, assetsDir) => {
  if (!existsSync(dir)) return null;
  const wanted = new Set(roms.extensions.map((ext) => ext.toLowerCase()));
  const rank = { assetsDir, assetExtension: roms.assetExtension };
  const candidates = readdirSync(dir)
    .filter((file) => wanted.has(extname(file).toLowerCase()))
    .sort((a, b) => preference(a, rank) - preference(b, rank));
  return candidates.length > 0 ? join(dir, candidates[0]) : null;
};

export { findRom, stemOf };
