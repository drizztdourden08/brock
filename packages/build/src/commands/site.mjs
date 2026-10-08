/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { portFor } from '@drizztdourden08/brock-thread/ports';
import { runBin } from '../run.mjs';
import { addSite } from '../site/add-site.mjs';
import { isSiteDir, loadSite } from '../site/load-site.mjs';
import { repoRootOf, siteDirs } from '../site/site-dirs.mjs';
import { apiTargetUrl, siteServer } from '../site/site-server.mjs';
import { SITE_CONFIG_FILE, SITE_MODES, SITE_USAGE, SITE_VITE_CONFIG_FILE } from '../site/site.constants.mjs';
import { syncSites } from '../site/sync-sites.mjs';

const slashed = (path) => path.replace(/\\/g, '/');

const VITE_VERBS = { dev: [], build: ['build'], preview: ['preview'] };

const runVite = async (rootDir, mode, passthrough) => {
  if (!isSiteDir(rootDir)) throw new Error(`brock site ${mode} runs in a site folder, the one holding ${SITE_CONFIG_FILE}.`);
  const repoRoot = repoRootOf(rootDir);
  const synced = await syncSites(repoRoot, { check: false, only: [slashed(relative(repoRoot, rootDir))] });
  if (synced !== 0) return synced;
  return runBin(rootDir, 'vite', [...VITE_VERBS[mode], '--config', SITE_VITE_CONFIG_FILE, ...passthrough]);
};

const listSites = async (rootDir) => {
  const repoRoot = repoRootOf(rootDir);
  const dirs = siteDirs(repoRoot);
  if (!dirs.length) console.log('No site in this repo. Add one with brock site add <name>.');
  for (const dir of dirs) {
    const siteDir = join(repoRoot, dir);
    const site = await loadSite(siteDir);
    const server = await siteServer(siteDir, site);
    const api = site.api ? `, ${site.api.path} -> ${apiTargetUrl(site.api, (offset) => portFor(server.base, server.slot, offset))}` : '';
    console.log(`  ${dir}  http://localhost:${server.port}${api}`);
  }
  return 0;
};

const add = async ({ rootDir, input, brand, api }) => {
  const { siteDir, port, changed } = await addSite({ rootDir, name: input, brand, api });
  console.log(`brock site: added ${siteDir} on tool port +${port} of the block${changed.length ? `; updated ${changed.join(', ')}` : ''}.`);
  console.log(`Next: pnpm install, then pnpm --dir ${siteDir} dev`);
  return 0;
};

/**
 * @param {{ rootDir: string, args?: string[], brand?: string, api?: string, passthrough?: string[] }} ctx
 * @returns {Promise<number>} exit code
 */
const runSite = async ({ rootDir, args = [], brand, api, passthrough = [] }) => {
  const [verb, input] = args;
  if (verb === 'add') return add({ rootDir, input, brand, api });
  if (verb === 'list') return listSites(rootDir);
  if (SITE_MODES.has(verb)) return runVite(rootDir, verb, passthrough);
  console.error(SITE_USAGE);
  return 1;
};

export { runSite };
