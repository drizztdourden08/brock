/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { findWorkspaceRoot, WORKSPACE_FILE } from '../../workspace.mjs';
import { workspaceDirs } from '../../workspace-dirs.mjs';
import { configKeyMoves } from './config-key-moves.mjs';

const PACKAGE_FILE = 'package.json';

const packageDirs = (repoRoot) => workspaceDirs(repoRoot).filter((dir) => existsSync(join(dir, PACKAGE_FILE)));

const configDirs = (rootDir) => {
  const repoRoot = existsSync(join(rootDir, WORKSPACE_FILE)) ? rootDir : findWorkspaceRoot(rootDir);
  const dirs = [rootDir, ...(repoRoot ? [repoRoot, ...packageDirs(repoRoot)] : [])];
  return [...new Set(dirs.map((dir) => resolve(dir)))];
};

const replayFile = (rootDir, file, { name, map, version }) => {
  const source = readFileSync(file, 'utf8');
  const result = configKeyMoves(source, map, { file: name, version });
  const path = relative(rootDir, file).replace(/\\/g, '/');
  if (result.source !== source) writeFileSync(file, result.source, 'utf8');
  return { path, changed: result.source !== source, todos: result.todos.map((todo) => ({ file: path, ...todo })) };
};

/**
 * @param {string} rootDir the folder brock migrate runs in
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {{ touched: string[], todos: { file: string, line: number, message: string }[] }} app root, repo root and workspace packages
 */
const configKeyReplay = (rootDir, release) => {
  const groups = Object.entries(release.configKeys ?? {});
  if (groups.length === 0) return { touched: [], todos: [] };
  const results = configDirs(rootDir).flatMap((dir) => groups
    .map(([name, map]) => ({ file: join(dir, name), name, map }))
    .filter(({ file }) => existsSync(file))
    .map(({ file, name, map }) => replayFile(rootDir, file, { name, map, version: release.version })));
  return { touched: results.filter((item) => item.changed).map((item) => item.path), todos: results.flatMap((item) => item.todos) };
};

export { configKeyReplay };
