/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { hasTessera } from '../../tessera/has-tessera.mjs';
import { findWorkspaceRoot } from '../../workspace.mjs';
import { workspaceDirs } from '../../workspace-dirs.mjs';
import { ownedFiles } from '../owned-files.mjs';
import { APP_ROOTS, DATA_FILE, SCRIPT_FILE, STYLE_FILE } from './tessera-renames.constants.mjs';

const isSourceFile = (file) => SCRIPT_FILE.test(file) || STYLE_FILE.test(file) || (DATA_FILE.test(file) && !/(?:^|[\\/])package\.json$/.test(file));

const under = (roots) => (file) => roots.some((root) => file.startsWith(`${root}/`));

const ownedUnder = (dir, roots) => ownedFiles(dir).filter(under(roots)).map((file) => join(dir, file));

const repoRootOf = (rootDir) => (existsSync(join(rootDir, 'pnpm-workspace.yaml')) ? rootDir : findWorkspaceRoot(rootDir));

const tesseraPackages = (repoRoot) => workspaceDirs(repoRoot).filter((dir) => resolve(dir) !== resolve(repoRoot) && hasTessera(dir));

const repoFiles = (repoRoot) => tesseraPackages(repoRoot).flatMap((dir) => ownedFiles(dir).map((file) => join(dir, file)));

/**
 * @param {string} rootDir the folder brock migrate runs in
 * @returns {string[]} the owned scripts, stylesheets and JSON, absolute
 */
const tesseraFiles = (rootDir) => {
  const repoRoot = repoRootOf(rootDir);
  const files = [...ownedUnder(rootDir, APP_ROOTS), ...(repoRoot ? repoFiles(repoRoot) : [])];
  return [...new Set(files.map((file) => resolve(file)))].filter(isSourceFile).sort();
};

export { tesseraFiles };
