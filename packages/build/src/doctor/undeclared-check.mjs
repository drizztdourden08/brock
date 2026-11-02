/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { declaredSpecs, readAppPackage } from './app-package.mjs';
import { importedPackages } from './source-imports.mjs';

/** @param {string} rootDir @returns {string[]} the prefixes tsconfig.json paths maps (an unreadable file maps none) */
const tsconfigAliases = (rootDir) => {
  try {
    const paths = JSON.parse(readFileSync(join(rootDir, 'tsconfig.json'), 'utf8')).compilerOptions?.paths ?? {};
    return Object.keys(paths).map((key) => key.replace(/\/?\*$/, ''));
  } catch {
    return [];
  }
};

/** @param {string} rootDir @param {import('../config.mjs').BrockConfig | null} config */
const aliasPrefixes = (rootDir, config) => [...Object.keys(config?.build?.aliases ?? {}), ...tsconfigAliases(rootDir)];

/** @param {string} rootDir @returns {Set<string>} what the app, or the workspace around it, declares */
const declaredNames = (rootDir) => {
  const workspace = findWorkspaceRoot(rootDir);
  const own = readAppPackage(rootDir);
  return new Set([own?.name, ...Object.keys(declaredSpecs(own)), ...(workspace ? Object.keys(declaredSpecs(readAppPackage(workspace))) : [])].filter(Boolean));
};

/** @param {string[]} files */
const where = (files) => (files.length > 1 ? `${files[0]} and ${files.length - 1} more` : files[0]);

/**
 * @type {{ label: string, run: (ctx: { rootDir: string, config: import('../config.mjs').BrockConfig | null }) => { problems: string[], detail: string } }}
 */
const undeclaredCheck = {
  label: 'Imports',
  run: ({ rootDir, config }) => {
    const declared = declaredNames(rootDir);
    const problems = [...importedPackages(rootDir, aliasPrefixes(rootDir, config))]
      .filter(([name]) => !declared.has(name))
      .map(([name, files]) => `${name} is imported by ${where(files)} but is not in package.json. Fix: pnpm add ${name}.`);
    return { problems, detail: 'every package the app source imports is in package.json' };
  },
};

export { undeclaredCheck };
