/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { writeDrifted } from '../modules/sync.mjs';
import { renderSiteFiles } from './site-files.mjs';
import { siteDirs } from './site-dirs.mjs';

const WORKSPACE_FILE = 'brock.workspace.mjs';

/**
 * @param {string} repoRoot
 * @returns {boolean} a Brock workspace, or a Brock app at the root
 */
const keepsWorkflows = (repoRoot) => existsSync(join(repoRoot, WORKSPACE_FILE)) || existsSync(join(repoRoot, CONFIG_FILE));

/**
 * @param {string} repoRoot
 * @param {{ check: boolean, only?: string[] }} opts only: the site folders to sync, from the repo root
 * @returns {Promise<number>} exit code; prints what it wrote or what drifted
 */
const syncSites = async (repoRoot, { check, only }) => {
  const sites = only ?? siteDirs(repoRoot);
  if (!sites.length) return 0;
  const workflows = keepsWorkflows(repoRoot);
  const files = (await Promise.all(sites.map((dir) => renderSiteFiles(repoRoot, dir, { workflows })))).flat();
  const { written, drifted } = writeDrifted(repoRoot, files, check);
  const label = `${sites.length} site(s): ${sites.join(', ')}`;
  if (check && drifted.length) {
    console.error(`brock check: ${drifted.length} managed file(s) drifted in ${label}:`);
    for (const path of drifted) console.error(`  ${path}`);
    console.error('Run `brock sync` to regenerate them.');
    return 1;
  }
  if (check) console.log(`brock check: ${label} in sync.`);
  else if (written.length) console.log(`brock sync: wrote ${written.length} file(s) for ${label}:\n${written.map((path) => `  ${path}`).join('\n')}`);
  else console.log(`brock sync: ${label} already in sync.`);
  return 0;
};

export { syncSites };
