/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { appDirs } from '../../commands/app-dirs.mjs';
import { findWorkspaceRoot } from '../../workspace.mjs';
import { RENAMES_FILE, TESSERA_PACKAGE } from './tessera-renames.constants.mjs';

const packageAbove = (dir) => {
  for (let at = dir; ; at = dirname(at)) {
    const candidate = join(at, 'node_modules', ...TESSERA_PACKAGE.split('/'));
    if (existsSync(join(candidate, 'package.json'))) return candidate;
    if (dirname(at) === at) return null;
  }
};

const searchDirs = (rootDir) => {
  const repoRoot = existsSync(join(rootDir, 'pnpm-workspace.yaml')) ? rootDir : findWorkspaceRoot(rootDir);
  return [rootDir, ...(repoRoot ? appDirs(repoRoot).map((app) => resolve(repoRoot, app)) : [])];
};

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/**
 * @param {string} rootDir the folder brock migrate runs in
 * @returns {{ dir: string, version: string, releases: Record<string, any>[] | null } | null} null when not installed
 */
const installedTessera = (rootDir) => {
  const dir = searchDirs(rootDir).map(packageAbove).find(Boolean);
  if (!dir) return null;
  const renames = join(dir, RENAMES_FILE);
  const releases = existsSync(renames) ? readJson(renames).releases : null;
  return { dir, version: String(readJson(join(dir, 'package.json')).version), releases: Array.isArray(releases) ? releases : null };
};

export { installedTessera };
