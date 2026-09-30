/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { linkSpec } from '../links/link-spec.mjs';
import { jsonFile } from '../provision/json-file.mjs';
import { BROCK_PACKAGE, CHECKOUT_PACKAGE_DIRS, DEPENDENCY_BLOCKS } from './upgrade.constants.mjs';

const packagesUnder = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ dir: join(dir, entry.name), name: jsonFile(join(dir, entry.name, 'package.json')).read()?.name }))
    .filter(({ name }) => typeof name === 'string' && BROCK_PACKAGE.test(name));

const checkoutPackages = (checkout) =>
  Object.fromEntries(
    CHECKOUT_PACKAGE_DIRS.map((base) => join(checkout, base))
      .filter((dir) => existsSync(dir))
      .flatMap(packagesUnder)
      .map(({ name, dir }) => [name, linkSpec(dir)]),
  );

/**
 * @param {Record<string, any>} pkg an app package.json
 * @param {string} checkout the Brock checkout to link
 * @returns {{ pkg: Record<string, any>, changed: string[] }}
 */
const linkBrock = (pkg, checkout) => {
  const links = checkoutPackages(checkout);
  const next = JSON.parse(JSON.stringify(pkg));
  const changed = [];
  for (const block of DEPENDENCY_BLOCKS) {
    const deps = next[block] ?? {};
    const moved = Object.keys(deps).filter((name) => links[name] && deps[name] !== links[name]);
    for (const name of moved) deps[name] = links[name];
    changed.push(...moved.map((name) => `${block}.${name}`));
  }
  return { pkg: next, changed };
};

export { linkBrock };
