/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { C_SOURCE } from './gate.constants.mjs';

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return walk(path);
  return C_SOURCE.test(entry.name) ? [path] : [];
});

const placeOf = (repoRoot, entry) => {
  const path = resolve(repoRoot, entry);
  const rel = relative(repoRoot, path);
  if (isAbsolute(entry) || isAbsolute(rel) || rel.startsWith('..')) throw new Error(`brock.config.ts gate.clangFormat: ${entry} is outside the repo; name it relative to the repo root`);
  if (!existsSync(path)) throw new Error(`brock.config.ts gate.clangFormat: ${entry} does not exist under ${repoRoot}`);
  return path;
};

/**
 * @param {string} repoRoot the folder gate.clangFormat paths start from
 * @param {string[]} entries folders or files from gate.clangFormat
 * @returns {string[]} every .c and .h file they hold, sorted
 */
const cSources = (repoRoot, entries) => [...new Set(entries.flatMap((entry) => {
  const path = placeOf(repoRoot, entry);
  return statSync(path).isDirectory() ? walk(path) : [path];
}))].sort();

export { cSources };
