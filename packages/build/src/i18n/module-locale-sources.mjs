/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { declaredDependencies } from '../modules/declared-dependencies.mjs';
import { packageReader } from '../modules/resolve.mjs';
import { scanLocaleDir } from './scan-locale-dir.mjs';

/**
 * @typedef {import('./scan-locale-dir.mjs').LocaleFile} LocaleFile
 * @typedef {{ id: string, kind: 'app' | 'module', root: string, files: LocaleFile[] }} LocaleSource
 */

const trimmed = (path) => path.replace(/^\.\//, '').replace(/\/$/, '');

/**
 * @param {string} rootDir the app root
 * @returns {LocaleSource[]} one source per module that sets brock.locales
 */
const moduleLocaleSources = (rootDir) => {
  const read = packageReader(rootDir);
  return declaredDependencies(rootDir).flatMap((name) => {
    const found = read(name);
    const rel = typeof found?.pkg.brock?.locales === 'string' ? trimmed(found.pkg.brock.locales) : null;
    if (!found || rel === null) return [];
    const root = `${name}/${rel}`;
    return [{ id: String(found.pkg.brock.id ?? name), kind: 'module', root, files: scanLocaleDir(join(found.dir, rel), root).files }];
  });
};

export { moduleLocaleSources };
