/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * @typedef {{ written: string[], current: string[] }} WriteReport  Root-relative paths
 */

/**
 * @param {string} source @param {string} target  Absolute paths
 * @returns {boolean}  True when the target holds the same bytes
 */
const sameFile = (source, target) => existsSync(target) && readFileSync(source).equals(readFileSync(target));

/**
 * @param {string} brandDir @param {string} rootDir
 * @param {import('./brand-files.mjs').BrandFile[]} files
 * @param {boolean} force
 * @returns {WriteReport}
 */
const copyFiles = (brandDir, rootDir, files, force) => {
  const written = [];
  const current = [];
  for (const { from, to } of files) {
    const source = join(brandDir, from);
    if (!existsSync(source)) throw new Error(`The brand at ${brandDir} is missing ${source}`);
    const target = join(rootDir, to);
    if (!force && sameFile(source, target)) {
      current.push(to);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    written.push(to);
  }
  return { written, current };
};

export { copyFiles };
