/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { launcherSource } from './launcher-source.mjs';

const MARKER = "const PACKAGE = '@drizztdourden08/brock';";

/**
 * @param {string} rootDir the app folder sync runs in
 * @returns {{ path: string, content: string }[]} launchers in the repo bin
 */
const renderLaunchers = (rootDir) => {
  const binDir = join(findWorkspaceRoot(rootDir) ?? rootDir, 'bin');
  if (!existsSync(binDir)) return [];
  return readdirSync(binDir)
    .filter((file) => file.endsWith('.mjs') && readFileSync(join(binDir, file), 'utf8').includes(MARKER))
    .map((file) => ({
      path: relative(rootDir, join(binDir, file)).replace(/\\/g, '/'),
      content: launcherSource(file.slice(0, -'.mjs'.length)),
    }));
};

export { renderLaunchers };
