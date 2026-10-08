/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { WORKSPACE_FILE } from '../workspace.mjs';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { SITES_GLOB } from './site.constants.mjs';

const ENTRY = `'${SITES_GLOB}'`;

const flowListWith = (line) => line.replace(/\[\s*(.*?)\s*\]/, (all, items) => `[${items ? `${items}, ` : ''}${ENTRY}]`);

/**
 * @param {string} text pnpm-workspace.yaml
 * @returns {string} the same file with apps/* in packages
 */
const withSitesGlob = (text) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const at = lines.findIndex((line) => /^packages:/.test(line));
  if (at === -1) return [`packages:`, `  - ${ENTRY}`, ...lines].join('\n');
  if (/^packages:\s*\[\s*\]/.test(lines[at])) lines.splice(at, 1, 'packages:', `  - ${ENTRY}`);
  else if (/\[/.test(lines[at])) lines[at] = flowListWith(lines[at]);
  else lines.splice(at + 1, 0, `  - ${ENTRY}`);
  return lines.join('\n');
};

/**
 * @param {string} repoRoot
 * @param {string} siteDir the site folder, from the repo root; it must exist
 * @returns {boolean} true when it added apps/* to the workspace globs
 */
const ensureSitesGlob = (repoRoot, siteDir) => {
  if (workspaceDirs(repoRoot).map((dir) => resolve(dir)).includes(resolve(repoRoot, siteDir))) return false;
  const file = join(repoRoot, WORKSPACE_FILE);
  writeFileSync(file, withSitesGlob(readFileSync(file, 'utf8')), 'utf8');
  return true;
};

export { ensureSitesGlob, withSitesGlob };
