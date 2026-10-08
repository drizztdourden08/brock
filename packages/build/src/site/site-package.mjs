/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { OWN_PACKAGE } from '../modules/sync.mjs';
import { WORKSPACE_FILE } from '../workspace.mjs';
import { SITE_PACKAGES, SITE_SCRIPTS } from './site.constants.mjs';

const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {});

const catalogNames = (repoRoot) => {
  const file = join(repoRoot, WORKSPACE_FILE);
  if (!existsSync(file)) return new Set();
  const names = [...readFileSync(file, 'utf8').matchAll(/^[ \t]+['"]?([^'":\s]+)['"]?:[ \t]*\S/gm)].map((match) => match[1]);
  return new Set(names);
};

/**
 * @param {string} spec a spec from the root package.json
 * @param {string} repoRoot
 * @param {string} siteRoot
 * @returns {string} a relative link moved to the site folder
 */
const rebased = (spec, repoRoot, siteRoot) => {
  const match = /^(link:|file:)(.+)$/.exec(spec);
  if (!match || isAbsolute(match[2])) return spec;
  return `${match[1]}${relative(siteRoot, resolve(repoRoot, match[2])).replace(/\\/g, '/')}`;
};

const FALLBACK = { '@drizztdourden08/brock-build': `^${OWN_PACKAGE.version}`, '@drizztdourden08/tessera': OWN_PACKAGE.peerDependencies?.['@drizztdourden08/tessera'] ?? 'latest' };

/**
 * @param {string} repoRoot
 * @param {string} siteRoot
 * @returns {(name: string) => string} the root's spec, the catalog, or Brock's
 */
const specFinder = (repoRoot, siteRoot) => {
  const root = readJson(join(repoRoot, 'package.json'));
  const declared = { ...root.devDependencies, ...root.dependencies };
  const catalog = catalogNames(repoRoot);
  return (name) => {
    if (declared[name]) return rebased(declared[name], repoRoot, siteRoot);
    if (catalog.has(name)) return 'catalog:';
    return FALLBACK[name] ?? 'latest';
  };
};

/**
 * @param {{ repoRoot: string, siteRoot: string, packageName: string }} opts
 * @returns {Record<string, unknown>} the site's package.json
 */
const sitePackageJson = ({ repoRoot, siteRoot, packageName }) => {
  const specOf = specFinder(repoRoot, siteRoot);
  const block = (names) => Object.fromEntries(names.map((name) => [name, specOf(name)]));
  return {
    name: packageName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { ...SITE_SCRIPTS },
    dependencies: block(SITE_PACKAGES.dependencies),
    devDependencies: block(SITE_PACKAGES.devDependencies),
  };
};

export { sitePackageJson, rebased };
