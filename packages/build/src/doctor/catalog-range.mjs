/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';

const indentOf = (line) => line.length - line.trimStart().length;

/** @param {string[]} lines @param {number} at the header line */
const blockAfter = (lines, at) => {
  const block = [];
  for (const line of lines.slice(at + 1)) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    if (indentOf(line) <= indentOf(lines[at])) break;
    block.push(line);
  }
  return block;
};

/** @param {string[]} lines @param {string} header */
const headerIndex = (lines, header) => lines.findIndex((line) => line.trim() === header);

/** @param {string} yaml @param {string} catalog '' for the default catalog */
const catalogLines = (yaml, catalog) => {
  const lines = yaml.split(/\r?\n/);
  if (!catalog) {
    const at = headerIndex(lines, 'catalog:');
    return at < 0 ? [] : blockAfter(lines, at);
  }
  const all = headerIndex(lines, 'catalogs:');
  if (all < 0) return [];
  const named = blockAfter(lines, all);
  const at = headerIndex(named, `${catalog}:`);
  return at < 0 ? [] : blockAfter(named, at);
};

/**
 * @param {string} rootDir the app folder
 * @param {string} spec a catalog: spec
 * @param {string} name
 * @returns {string | null} the catalog range, null when it cannot be read
 */
const catalogRange = (rootDir, spec, name) => {
  const dir = [rootDir, findWorkspaceRoot(rootDir)].find((candidate) => candidate && existsSync(join(candidate, 'pnpm-workspace.yaml')));
  if (!dir) return null;
  const lines = catalogLines(readFileSync(join(dir, 'pnpm-workspace.yaml'), 'utf8'), spec.replace(/^catalog:/, '').trim());
  const key = name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const hit = lines.map((line) => new RegExp(`^\\s*['"]?${key}['"]?:\\s*['"]?([^'"#\\s]+)`).exec(line)).find(Boolean);
  return hit ? hit[1] : null;
};

export { catalogRange };
