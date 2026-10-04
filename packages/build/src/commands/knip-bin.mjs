/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const STANDARDS_ROOT = dirname(createRequire(import.meta.url).resolve('@drizztdourden08/standards/package.json'));

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

const knipPackageAbove = (file) => {
  for (let dir = dirname(file); dir !== dirname(dir); dir = dirname(dir)) {
    const pkgFile = join(dir, 'package.json');
    if (existsSync(pkgFile) && readJson(pkgFile).name === 'knip') return pkgFile;
  }
  return null;
};

const knipFrom = (dir) => {
  try {
    return knipPackageAbove(createRequire(join(dir, 'package.json')).resolve('knip'));
  } catch {
    return null;
  }
};

/**
 * @param {string} rootDir the repo root
 * @returns {string | null} the repo's knip bin, else standards'
 */
const knipBin = (rootDir) => {
  const pkgFile = [rootDir, STANDARDS_ROOT].map(knipFrom).find(Boolean);
  if (!pkgFile) return null;
  const { bin } = readJson(pkgFile);
  return resolve(dirname(pkgFile), typeof bin === 'string' ? bin : bin.knip);
};

export { knipBin };
