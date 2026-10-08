/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { appDirs } from '../commands/app-dirs.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { WORKSPACE_FILE } from '../workspace.mjs';
import { loadSite } from './load-site.mjs';
import { DEFAULT_SITE_BRAND, SITE_NAME_RULE, SITES_DIR } from './site.constants.mjs';
import { repoRootOf, siteDirs } from './site-dirs.mjs';
import { sitePackageJson } from './site-package.mjs';
import { registerSite } from './site-registrations.mjs';
import { ensureSitesGlob } from './sites-glob.mjs';
import { syncSites } from './sync-sites.mjs';
import { writeSiteTemplate } from './write-site-template.mjs';
import { writeGuide } from '../tessera/write-guide.mjs';

const titleOf = (name) => name.split('-').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ');

/**
 * @param {string | undefined} value --api: a URL, or a port offset of the block
 * @returns {string | number | null}
 */
const parseApi = (value) => {
  if (value === undefined) return null;
  if (/^[1-9]$/.test(value)) return Number(value);
  if (/^https?:\/\/\S+$/.test(value)) return value;
  throw new Error('--api takes an http or https URL, or a tool port offset from 1 to 9.');
};

const apiLine = (api) => {
  if (api === null) return '';
  return typeof api === 'number' ? `  api: { portOffset: ${api} },\n` : `  api: '${api}',\n`;
};

const takenOffsets = async (repoRoot) => {
  const sites = await Promise.all(siteDirs(repoRoot).map((dir) => loadSite(join(repoRoot, dir))));
  return new Set(sites.flatMap((site) => [site.ports.offset, ...(site.api && 'portOffset' in site.api.target ? [site.api.target.portOffset] : [])]));
};

const freeOffset = (taken) => {
  const offset = [1, 2, 3, 4, 5, 6, 7, 8, 9].find((candidate) => !taken.has(candidate));
  if (offset === undefined) throw new Error('Every tool port of the block (offsets 1 to 9) is taken by a site or its API.');
  return offset;
};

const scopeOf = (repoRoot) => {
  const file = join(repoRoot, 'brock.scope');
  if (existsSync(file)) return readFileSync(file, 'utf8').trim();
  const name = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')).name ?? '';
  return name.startsWith('@') ? name.split('/')[0] : null;
};

const defaultBrand = async (repoRoot) => {
  const [app] = appDirs(repoRoot);
  if (app === undefined) return DEFAULT_SITE_BRAND;
  const { product } = await loadBrockConfig(resolve(repoRoot, app));
  return product.icons?.brand ?? DEFAULT_SITE_BRAND;
};

const assertNewSite = (repoRoot, name) => {
  if (!existsSync(join(repoRoot, WORKSPACE_FILE))) throw new Error(`A site lives in the pnpm workspace beside the app, and ${repoRoot} has no ${WORKSPACE_FILE}.`);
  if (!SITE_NAME_RULE.test(name ?? '')) throw new Error('brock site add <name>: the name is a lowercase word (letters, digits, dashes), such as docs or store.');
  if (existsSync(join(repoRoot, SITES_DIR, name))) throw new Error(`${SITES_DIR}/${name} exists already.`);
};

/**
 * @param {{ rootDir: string, name: string, brand?: string, api?: string }} input
 * @returns {Promise<{ siteDir: string, port: number, changed: string[] }>}
 */
const addSite = async ({ rootDir, name, brand, api }) => {
  const repoRoot = repoRootOf(rootDir);
  assertNewSite(repoRoot, name);
  const apiValue = parseApi(api);
  const taken = await takenOffsets(repoRoot);
  if (typeof apiValue === 'number') taken.add(apiValue);
  const offset = freeOffset(taken);
  const siteDir = `${SITES_DIR}/${name}`;
  const siteRoot = join(repoRoot, siteDir);
  const values = { NAME: name, TITLE: titleOf(name), BRAND: brand ?? (await defaultBrand(repoRoot)), PORT_OFFSET: String(offset), API: apiLine(apiValue) };
  writeSiteTemplate(siteRoot, values);
  const scope = scopeOf(repoRoot);
  const pkg = sitePackageJson({ repoRoot, siteRoot, packageName: scope ? `${scope}/${name}` : name });
  writeFileSync(join(siteRoot, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  const changed = [...(ensureSitesGlob(repoRoot, siteDir) ? [WORKSPACE_FILE] : []), ...registerSite(repoRoot, siteDir)];
  await syncSites(repoRoot, { check: false, only: [siteDir] });
  await writeGuide(repoRoot, { label: 'brock site add' });
  return { siteDir, port: offset, changed };
};

export { addSite, parseApi };
