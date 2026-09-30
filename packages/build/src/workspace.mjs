/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

const isCheckoutRoot = (dir) => existsSync(join(dir, '.git'));

/**
 * @param {string} dir
 * @returns {string | null} the enclosing workspace, never past a git checkout
 */
const findWorkspaceRoot = (dir) => {
  if (isCheckoutRoot(dir)) return null;
  let current = dirname(dir);
  for (;;) {
    if (existsSync(join(current, WORKSPACE_FILE))) return current;
    const parent = dirname(current);
    if (parent === current || isCheckoutRoot(current)) return null;
    current = parent;
  }
};

const yamlKey = (name) => (name.startsWith('@') ? `'${name}'` : name);

/**
 * @param {string} rootDir
 * @param {Record<string, string>} entries
 * @returns {string[]}
 */
const mergeCatalog = (rootDir, entries) => {
  const file = join(rootDir, WORKSPACE_FILE);
  const lines = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const present = new Set();
  let catalogAt = -1;
  let inCatalog = false;
  lines.forEach((line, i) => {
    if (/^catalog:\s*(\{\s*\})?\s*$/.test(line)) { catalogAt = i; inCatalog = true; return; }
    if (inCatalog && /^\S/.test(line)) inCatalog = false;
    const entry = inCatalog ? /^\s+['"]?([^'":\s]+)['"]?:\s*(.+)$/.exec(line) : null;
    if (entry) present.add(entry[1]);
  });
  const added = Object.keys(entries).filter((name) => !present.has(name)).sort();
  if (!added.length) return [];
  const block = added.map((name) => `  ${yamlKey(name)}: ${entries[name]}`);
  if (catalogAt === -1) lines.push('catalog:', ...block);
  else {
    lines[catalogAt] = 'catalog:';
    let end = catalogAt + 1;
    while (end < lines.length && /^\s+\S/.test(lines[end])) end += 1;
    lines.splice(end, 0, ...block);
  }
  writeFileSync(file, `${lines.join('\n').replace(/\n*$/, '')}\n`, 'utf8');
  return added;
};

export { findWorkspaceRoot, mergeCatalog, WORKSPACE_FILE };
