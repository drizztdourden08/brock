/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { packageNameOf } from '../declared-externals.mjs';
import { barrelOf, nodeReach } from './node-reach.mjs';
import { runtimeSpecifiers } from './runtime-specifiers.mjs';

const RENDERER_DIR = 'src';
const SOURCE = /\.tsx?$/;

const rendererFiles = (appDir) => {
  const dir = join(appDir, RENDERER_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE.test(entry.name) && !entry.parentPath.includes(`${sep}node_modules`))
    .map((entry) => join(entry.parentPath, entry.name));
};

const workspacePackageDir = (appDir, name) => {
  const link = join(appDir, 'node_modules', ...name.split('/'));
  if (!existsSync(link)) return null;
  const real = realpathSync(link);
  return real.split(sep).includes('node_modules') ? null : real;
};

const problemOf = (appDir, name, cache) => {
  if (!cache.has(name)) {
    const dir = workspacePackageDir(appDir, name);
    const barrel = dir ? barrelOf(dir) : null;
    const reach = barrel ? nodeReach(barrel.entry, dir) : null;
    cache.set(name, reach ? { ...reach, subpaths: barrel.subpaths } : null);
  }
  return cache.get(name);
};

/**
 * @param {string} appDir  An app root
 * @param {string} [prefix]  Put before each file path, for an app inside a workspace
 * @returns {string[]}  Renderer imports of a barrel that loads Node
 */
const nodeBarrelNotes = (appDir, prefix = '') => {
  const cache = new Map();
  return rendererFiles(appDir).flatMap((file) => {
    const bare = runtimeSpecifiers(readFileSync(file, 'utf8')).filter((spec) => packageNameOf(spec) === spec);
    return [...new Set(bare)].flatMap((name) => {
      const problem = problemOf(appDir, name, cache);
      if (!problem) return [];
      const where = `${prefix}${relative(appDir, file).replace(/\\/g, '/')}`;
      const subpath = `${name}/${problem.subpaths[0].replace(/^\.\//, '')}`;
      return [`warning: ${where} imports the ${name} barrel, which loads Node code (${problem.spec} in ${problem.file}); a renderer imports a subpath such as ${subpath}`];
    });
  });
};

export { nodeBarrelNotes };
