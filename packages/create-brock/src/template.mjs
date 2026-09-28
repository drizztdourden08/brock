/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');

const TEMPLATE_CANDIDATES = [resolve(PACKAGE_DIR, '../../templates/app'), join(PACKAGE_DIR, 'template')];

const SKIPPED = new Set(['node_modules', 'dist', 'release', 'out', '.brock', '.user-data', 'pnpm-workspace.yaml']);

const PACKED_NAMES = { _gitignore: '.gitignore' };

const locateTemplate = () => {
  const found = TEMPLATE_CANDIDATES.find((dir) => existsSync(join(dir, 'brock.config.ts')));
  if (!found) throw new Error(`No app template found. Looked in:\n  ${TEMPLATE_CANDIDATES.join('\n  ')}`);
  return found;
};

const isEmptyDir = (dir) => !existsSync(dir) || readdirSync(dir).length === 0;

const copyTree = (fromDir, toDir, skip) => {
  mkdirSync(toDir, { recursive: true });
  for (const entry of readdirSync(fromDir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const from = join(fromDir, entry.name);
    const to = join(toDir, PACKED_NAMES[entry.name] ?? entry.name);
    if (entry.isDirectory()) copyTree(from, to, new Set());
    else copyFileSync(from, to);
  }
};

/**
 * @param {string} templateDir
 * @param {string} targetDir
 */
const copyTemplate = (templateDir, targetDir) => copyTree(templateDir, targetDir, SKIPPED);

export { locateTemplate, copyTemplate, isEmptyDir };
