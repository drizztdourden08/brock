/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));

const write = (file, pkg) => writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

const nearestPackageJson = (file) => {
  const dir = dirname(file);
  if (existsSync(join(dir, 'package.json'))) return join(dir, 'package.json');
  return dir === dirname(dir) ? null : nearestPackageJson(dir);
};

/**
 * @param {string} file  a package.json
 * @param {Record<string, string>} dependencies  name to version spec
 * @returns {boolean} whether it changed; listed names stay
 */
const addDependencies = (file, dependencies) => {
  const pkg = read(file);
  const missing = Object.entries(dependencies).filter(([name]) => !pkg.dependencies?.[name] && !pkg.devDependencies?.[name]);
  if (missing.length === 0) return false;
  write(file, { ...pkg, dependencies: { ...pkg.dependencies, ...Object.fromEntries(missing) } });
  return true;
};

/**
 * @param {string[]} names
 * @param {Record<string, any>[]} pkgs  the manifests to copy from
 * @returns {Record<string, string>}
 */
const specsFrom = (names, pkgs) => Object.fromEntries(names.flatMap((name) => {
  const spec = pkgs.map((pkg) => pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]).find(Boolean);
  return spec ? [[name, spec]] : [];
}));

const packageJson = { read, write, nearestPackageJson, addDependencies, specsFrom };

export { packageJson };
