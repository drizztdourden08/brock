/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { keepCrossDriveLinks, mergeCatalog } from '@drizztdourden08/brock-build';

const CATALOG_SOURCES = (templateDir) => [resolve(templateDir, '../../pnpm-workspace.yaml'), join(templateDir, 'pnpm-workspace.yaml')];

const NPMRC = `@drizztdourden08:registry=https://npm.pkg.github.com
auto-install-peers=true
dedupe-peer-dependents=true
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*stylelint*
public-hoist-pattern[]=*markdownlint*
public-hoist-pattern[]=typescript
`;

const BUILT_DEPENDENCIES = ['electron', 'esbuild'];

/**
 * @param {string} file
 * @returns {Record<string, string>}
 */
const readCatalog = (file) => {
  const catalog = {};
  let inCatalog = false;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trimEnd();
    if (/^catalog:\s*$/.test(line)) { inCatalog = true; continue; }
    if (inCatalog && /^\S/.test(line)) inCatalog = false;
    const entry = inCatalog ? /^\s+['"]?([^'":\s]+)['"]?:\s*(.+)$/.exec(line) : null;
    if (entry) catalog[entry[1]] = entry[2].trim();
  }
  return catalog;
};

/**
 * @param {string} templateDir
 * @returns {Record<string, string>}
 */
const templateCatalog = (templateDir) => {
  const source = CATALOG_SOURCES(templateDir).find((file) => existsSync(file));
  if (!source) throw new Error(`No pnpm-workspace.yaml with a catalog near ${templateDir}`);
  return readCatalog(source);
};

const yamlKey = (name) => (name.startsWith('@') ? `'${name}'` : name);

/**
 * @param {Record<string, string>} catalog
 * @returns {string}
 */
const renderWorkspaceYaml = (catalog) => {
  const entries = Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b));
  const lines = ['packages: []', '', 'catalog:', ...entries.map(([name, range]) => `  ${yamlKey(name)}: ${range}`), '', 'onlyBuiltDependencies:', ...BUILT_DEPENDENCIES.map((name) => `  - ${name}`), ''];
  return lines.join('\n');
};

/**
 * @param {string} targetDir
 * @param {string} templateDir
 * @returns {Record<string, string>}
 */
const neededCatalog = (targetDir, templateDir) => {
  const pkg = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf8'));
  const wanted = new Set(
    Object.entries({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) })
      .filter(([, spec]) => spec === 'catalog:')
      .map(([name]) => name),
  );
  const catalog = Object.fromEntries(Object.entries(templateCatalog(templateDir)).filter(([name]) => wanted.has(name)));
  const missing = [...wanted].filter((name) => !catalog[name]);
  if (missing.length) throw new Error(`The template catalog has no entry for: ${missing.join(', ')}`);
  return catalog;
};

/**
 * @param {string} targetDir
 * @param {Record<string, string>} catalog
 * @param {string | null} workspaceRoot
 * @returns {string[]} the files written or updated
 */
const writeCatalog = (targetDir, catalog, workspaceRoot) => {
  if (workspaceRoot) {
    const added = mergeCatalog(workspaceRoot, catalog);
    return added.length ? [`${join(workspaceRoot, 'pnpm-workspace.yaml')} (+${added.length} catalog entries)`] : [];
  }
  writeFileSync(join(targetDir, 'pnpm-workspace.yaml'), renderWorkspaceYaml(catalog), 'utf8');
  writeFileSync(join(targetDir, '.npmrc'), NPMRC, 'utf8');
  return ['pnpm-workspace.yaml', '.npmrc'];
};

/**
 * @param {string} targetDir
 * @param {string} templateDir
 * @param {string | null} workspaceRoot
 * @returns {string[]} the files written or updated
 */
const writePnpmFiles = (targetDir, templateDir, workspaceRoot = null) => {
  const written = writeCatalog(targetDir, neededCatalog(targetDir, templateDir), workspaceRoot);
  const crossDrive = keepCrossDriveLinks(targetDir, workspaceRoot ?? targetDir).length > 0;
  return crossDrive ? [...written, 'prefer-frozen-lockfile=false and a .gitattributes line (the links cross drives)'] : written;
};

export { writePnpmFiles };
