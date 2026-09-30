/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { BROCK_PACKAGE, BUILD_PACKAGE } from './upgrade.constants.mjs';

const packageOf = (dir) => jsonFile(join(dir, 'package.json')).read();

const checkoutAbove = (dir) => {
  for (let at = dir; ; at = dirname(at)) {
    if (existsSync(join(at, 'packages', 'build', 'package.json'))) return at;
    if (dirname(at) === at) return null;
  }
};

const brockSpecs = (pkg) =>
  Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })
    .filter(([name]) => BROCK_PACKAGE.test(name))
    .map(([, spec]) => String(spec));

const modeOf = (specs) => {
  if (specs.some((spec) => spec.startsWith('link:'))) return 'link';
  if (specs.length === 0) return 'none';
  return specs.every((spec) => spec.startsWith('workspace:')) ? 'workspace' : 'registry';
};

/**
 * @param {string} rootDir an app checkout
 * @returns {import('./upgrade.type.mjs').BrockInstall}
 */
const brockInstall = (rootDir) => {
  const pkg = packageOf(rootDir) ?? {};
  const specs = brockSpecs(pkg);
  const installed = packageOf(join(rootDir, 'node_modules', ...BUILD_PACKAGE.split('/')))?.version ?? null;
  const pinned = pkg.brock?.version ?? installed;
  const mode = modeOf(specs);
  const link = specs.find((spec) => spec.startsWith('link:'));
  const checkout = link ? checkoutAbove(resolve(rootDir, link.slice('link:'.length))) : null;
  return { mode, pinned: pinned ? String(pinned) : null, checkout };
};

/**
 * @param {string} checkout a Brock checkout
 * @returns {string} the version its brock-build carries
 */
const checkoutVersion = (checkout) => {
  const version = packageOf(join(checkout, 'packages', 'build'))?.version;
  if (typeof version !== 'string') throw new Error(`${checkout} is not a Brock checkout: packages/build/package.json is missing.`);
  return version;
};

const brockInstallOf = Object.freeze({ read: brockInstall, checkoutVersion, packageOf });

export { brockInstallOf };
