/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MISSING_MODULE_CODES } from '../look/look.constants.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { appDirs } from './app-dirs.mjs';

const TESSERA_CLI = '@drizztdourden08/tessera/cli';
const NOT_INSTALLED = 'brock tessera: @drizztdourden08/tessera is not installed in this app; add it with pnpm add -D @drizztdourden08/tessera';
const TOO_OLD = 'brock tessera: the installed @drizztdourden08/tessera has no command line entry (@drizztdourden08/tessera/cli); update it with pnpm up @drizztdourden08/tessera';

const resolveFrom = (dir) => {
  try {
    return { entry: createRequire(join(dir, 'package.json')).resolve(TESSERA_CLI) };
  } catch (error) {
    if (!MISSING_MODULE_CODES.has(error?.code)) throw error;
    return { entry: null, tooOld: error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED' };
  }
};

const searchDirs = (cwd) => {
  const repoRoot = existsSync(join(cwd, 'pnpm-workspace.yaml')) ? cwd : findWorkspaceRoot(cwd);
  return [cwd, ...(repoRoot ? appDirs(repoRoot).map((app) => resolve(repoRoot, app)) : [])];
};

/**
 * @param {string} cwd
 * @returns {{ entry: string | null, tooOld: boolean }} the module, from cwd or a workspace app
 */
const findTesseraCli = (cwd) => {
  let tooOld = false;
  for (const dir of searchDirs(cwd)) {
    const found = resolveFrom(dir);
    if (found.entry) return { entry: found.entry, tooOld: false };
    tooOld ||= found.tooOld;
  }
  return { entry: null, tooOld };
};

/**
 * @param {{ args: string[], cwd: string }} ctx
 * @returns {Promise<number>} the exit code of the Tessera command
 */
const runTesseraCommand = async ({ args, cwd }) => {
  const { entry, tooOld } = findTesseraCli(cwd);
  if (!entry) {
    console.error(tooOld ? TOO_OLD : NOT_INSTALLED);
    return 1;
  }
  const { runTessera } = await import(pathToFileURL(entry).href);
  return runTessera(args, { cwd });
};

export { runTesseraCommand };
