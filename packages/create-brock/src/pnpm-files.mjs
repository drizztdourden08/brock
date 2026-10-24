/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { ensurePnpmPackageManager, keepCrossDriveLinks, mergeCatalog } from '@drizztdourden08/brock-build';
import { TESSERA, tesseraRange } from './tessera-range.mjs';

const CATALOG_SOURCES = (templateDir) => [resolve(templateDir, '../../pnpm-workspace.yaml'), join(templateDir, 'pnpm-workspace.yaml')];

const NPMRC_TEMPLATE = createRequire(import.meta.url).resolve('@drizztdourden08/standards/templates/npmrc');

const BUILT_DEPENDENCIES = ['electron', 'esbuild'];

const SERVER_BUILT_DEPENDENCIES = ['esbuild'];

const builtDependencies = (windowless) => (windowless ? SERVER_BUILT_DEPENDENCIES : BUILT_DEPENDENCIES);

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
  return { ...readCatalog(source), [TESSERA]: tesseraRange(templateDir) };
};

const yamlKey = (name) => (name.startsWith('@') ? `'${name}'` : name);

/**
 * @param {Record<string, string>} catalog
 * @param {string[]} built the dependencies pnpm may run install scripts for
 * @returns {string}
 */
const renderWorkspaceYaml = (catalog, built) => {
  const entries = Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b));
  const lines = ['packages: []', '', 'catalog:', ...entries.map(([name, range]) => `  ${yamlKey(name)}: ${range}`), '', 'onlyBuiltDependencies:', ...built.map((name) => `  - ${name}`), ''];
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
 * @param {string[]} built
 * @returns {string[]} the files written or updated
 */
const writeCatalog = (targetDir, catalog, workspaceRoot, built) => {
  if (workspaceRoot) {
    const added = mergeCatalog(workspaceRoot, catalog);
    return added.length ? [`${join(workspaceRoot, 'pnpm-workspace.yaml')} (+${added.length} catalog entries)`] : [];
  }
  writeFileSync(join(targetDir, 'pnpm-workspace.yaml'), renderWorkspaceYaml(catalog, built), 'utf8');
  copyFileSync(NPMRC_TEMPLATE, join(targetDir, '.npmrc'));
  return ['pnpm-workspace.yaml', '.npmrc'];
};

/**
 * @param {string} targetDir
 * @param {string} templateDir
 * @param {string | null} workspaceRoot
 * @param {string[]} built
 * @returns {string[]} the files written or updated
 */
const writePnpmFiles = (targetDir, templateDir, workspaceRoot = null, built = BUILT_DEPENDENCIES) => {
  const written = writeCatalog(targetDir, neededCatalog(targetDir, templateDir), workspaceRoot, built);
  const packageManager = ensurePnpmPackageManager(workspaceRoot ?? targetDir);
  if (packageManager.status === 'added') written.push(`package.json packageManager ${packageManager.value}`);
  const crossDrive = keepCrossDriveLinks(targetDir, workspaceRoot ?? targetDir).length > 0;
  return crossDrive ? [...written, 'prefer-frozen-lockfile=false and a .gitattributes line (the links cross drives)'] : written;
};

export { builtDependencies, writePnpmFiles };
