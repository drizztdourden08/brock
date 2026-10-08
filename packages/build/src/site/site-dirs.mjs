/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { isSiteDir } from './load-site.mjs';

const slashed = (path) => path.replace(/\\/g, '/');

/**
 * @param {string} dir an app root, a site folder or the repo root
 * @returns {string} the enclosing pnpm workspace, else the folder
 */
const repoRootOf = (dir) => findWorkspaceRoot(dir) ?? dir;

/**
 * @param {string} repoRoot
 * @returns {string[]} the site folders, from the repo root
 */
const siteDirs = (repoRoot) => workspaceDirs(repoRoot).filter(isSiteDir).map((dir) => slashed(relative(repoRoot, dir)));

export { repoRootOf, siteDirs };
