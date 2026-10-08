/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { workspaceDirs } from '../workspace-dirs.mjs';

const slashed = (path) => path.replace(/\\/g, '/');

const packagesOf = (rootDir) => workspaceDirs(rootDir).flatMap((dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return [];
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies });
  return [{ dir: slashed(relative(rootDir, dir)), name: pkg.name ?? dir, deps }];
});

const ownerOf = (packages, file) => packages
  .filter((pkg) => file.startsWith(`${pkg.dir}/`))
  .sort((a, b) => b.dir.length - a.dir.length)[0] ?? null;

const dependsOnChanged = (app, packages, changed) => {
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]));
  const seen = new Set();
  const stack = [app.name];
  while (stack.length) {
    const name = stack.pop();
    if (changed.has(name)) return true;
    if (seen.has(name)) continue;
    seen.add(name);
    stack.push(...(byName.get(name)?.deps ?? []).filter((dep) => byName.has(dep)));
  }
  return false;
};

/**
 * @param {{ rootDir: string, appDir: string, files: string[] }} input rootDir is the repo root; files from it
 * @returns {boolean} the files touch the app or what it builds on
 */
const affectsApp = ({ rootDir, appDir, files }) => {
  const packages = packagesOf(rootDir);
  const app = packages.find((pkg) => pkg.dir === slashed(appDir));
  const owners = files.map((file) => ownerOf(packages, slashed(file)));
  if (!app || owners.includes(null)) return true;
  return dependsOnChanged(app, packages, new Set(owners.map((owner) => owner.name)));
};

/**
 * @param {string} rootDir
 * @param {string} base a git ref
 * @returns {string[]} the files changed since the merge base with it
 */
const changedSince = (rootDir, base) => execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: rootDir, encoding: 'utf8' })
  .split('\n').map((line) => line.trim()).filter(Boolean);

export { affectsApp, changedSince };
