/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { BUILD_INPUTS, BUILD_OUTPUTS, DIST_RENDERER, NOT_SOURCES } from './freshness.constants.mjs';
import { halfBuildReason } from './half-build-reason.mjs';

const skipped = (name) => name.startsWith('.') || NOT_SOURCES.has(name);

const newestSource = (path) => {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  if (!stat.isDirectory()) return stat.mtimeMs;
  return Math.max(0, ...readdirSync(path).filter((name) => !skipped(name)).map((name) => newestSource(join(path, name))));
};

const manifestOf = (dir) => {
  const file = join(dir, 'package.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
};

const depsOf = (pkg) => Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies });

const workspacePackagesUsed = (appDir) => {
  const root = findWorkspaceRoot(appDir);
  if (!root) return [];
  const byName = new Map(workspaceDirs(root).map((dir) => [manifestOf(dir).name, dir]).filter(([name]) => name));
  const found = new Set();
  const stack = depsOf(manifestOf(appDir));
  while (stack.length) {
    const dir = byName.get(stack.pop());
    if (!dir || dir === appDir || found.has(dir)) continue;
    found.add(dir);
    stack.push(...depsOf(manifestOf(dir)));
  }
  return [...found];
};

/**
 * @param {string} appDir
 * @returns {string | null} why dist is behind the sources, or null
 */
const buildStaleReason = (appDir) => {
  const missing = BUILD_OUTPUTS.find((output) => !existsSync(join(appDir, output)));
  if (missing) return `${missing} is missing`;
  const half = halfBuildReason(appDir);
  if (half) return half;
  const built = statSync(join(appDir, DIST_RENDERER)).mtimeMs;
  const own = BUILD_INPUTS.find((input) => newestSource(join(appDir, input)) > built);
  if (own) return `${own} changed since the last build`;
  const used = workspacePackagesUsed(appDir).find((dir) => newestSource(dir) > built);
  return used ? `${relative(appDir, used).replace(/\\/g, '/')} changed since the last build` : null;
};

export { buildStaleReason };
