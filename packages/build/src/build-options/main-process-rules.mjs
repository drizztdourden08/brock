/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { appRoots } from './app-roots.mjs';
import { globToRegExp } from './glob-to-regexp.mjs';
import { PACKAGE_SPEC, RENDERER_FILES, RENDERER_FOLDERS, RENDERER_PACKAGES, TESSERA_PACKAGE } from './main-process-guard.constants.mjs';
import { moduleFile } from './module-file.mjs';

const INSTALLED_PACKAGE = /\/node_modules\/((?:@[^/]+\/)?[^/]+)\/(?!.*\/node_modules\/)/;

const sortEntries = (entries) => ({
  packages: entries.filter((entry) => PACKAGE_SPEC.test(entry)),
  paths: entries.filter((entry) => !PACKAGE_SPEC.test(entry)).map(globToRegExp),
});

const isSpecifierOf = (entry, specifier) => specifier === entry || specifier.startsWith(`${entry}/`);

const rendererPaths = () => [...RENDERER_FOLDERS.map((folder) => `src/${folder}`), ...RENDERER_FILES].map(globToRegExp);

/**
 * @param {string} rootDir the app folder
 * @param {{ forbid?: string[], allow?: string[] }} [options] mainProcess of brock.config.ts
 * @returns {{ forbidsSpecifier: (specifier: string) => boolean, forbidsModule: (id: string) => boolean }} what the main process and the preload may not reach
 */
const mainProcessRules = (rootDir, { forbid = [], allow = [] } = {}) => {
  const roots = appRoots(rootDir);
  const forbidden = sortEntries(forbid);
  const allowed = sortEntries(allow);
  const pathMatches = (patterns, file) => roots.some((root) => {
    const rel = relative(root, file).replace(/\\/g, '/');
    return patterns.some((pattern) => pattern.test(rel));
  });
  const blocked = (name) =>
    (TESSERA_PACKAGE.test(`${name}/`) || [...RENDERER_PACKAGES, ...forbidden.packages].some((entry) => isSpecifierOf(entry, name)))
    && !allowed.packages.some((entry) => isSpecifierOf(entry, name));
  const forbidsModule = (id) => {
    const file = moduleFile(id);
    const installed = INSTALLED_PACKAGE.exec(file)?.[1];
    if (installed) return blocked(installed) && !allowed.packages.some((entry) => entry.startsWith(`${installed}/`));
    if (pathMatches(allowed.paths, file)) return false;
    return pathMatches([...rendererPaths(), ...forbidden.paths], file);
  };
  return { forbidsSpecifier: blocked, forbidsModule };
};

export { mainProcessRules };
