/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { appDirs } from '../commands/app-dirs.mjs';
import { NOTES_DIR } from '../packaging/packaging.constants.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';

const WORKSPACE_FILE = 'brock.workspace.mjs';
const DEFAULT_TAG_PREFIX = 'v';

const slashed = (path) => path.replace(/\\/g, '/');

/**
 * @typedef {object} ReleaseLayout
 * @property {string} repoDir the repo root
 * @property {string} appDir the app folder from the repo root, '.' for a standalone app
 * @property {string[]} apps every Brock app of the repo, from the repo root
 * @property {{ name: string, tagPrefix: string, notesDir: string } | null} app set when the repo has several apps
 * @property {string} notesDir the folder of the app's notes, from the repo root
 * @property {string} tagPrefix
 */

/**
 * @param {string} rootDir the app root
 * @param {{ releaseTagPrefix?: string }} product
 * @returns {ReleaseLayout | null} null in a pnpm workspace that is not a Brock repo
 */
const releaseLayout = (rootDir, product) => {
  const tagPrefix = product.releaseTagPrefix ?? DEFAULT_TAG_PREFIX;
  const workspace = findWorkspaceRoot(rootDir);
  if (!workspace) return { repoDir: rootDir, appDir: '.', apps: ['.'], app: null, notesDir: NOTES_DIR, tagPrefix };
  if (!existsSync(join(workspace, WORKSPACE_FILE))) return null;
  const appDir = slashed(relative(workspace, rootDir));
  const apps = appDirs(workspace);
  if (!apps.includes(appDir)) return null;
  if (apps.length < 2) return { repoDir: workspace, appDir, apps, app: null, notesDir: NOTES_DIR, tagPrefix };
  const name = basename(appDir);
  if (!product.releaseTagPrefix) {
    throw new Error(`${appDir}: this repo releases ${apps.length} apps, so each tags its releases apart. Set product.releaseTagPrefix in ${appDir}/brock.config.ts, e.g. '${name}-v'; the updater reads the same prefix.`);
  }
  const notesDir = `${appDir}/${NOTES_DIR}`;
  return { repoDir: workspace, appDir, apps, app: { name, tagPrefix, notesDir }, notesDir, tagPrefix };
};

export { releaseLayout };
