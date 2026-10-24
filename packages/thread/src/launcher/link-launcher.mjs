/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { WORKSPACE_FILE } from '../workspace/define-workspace.constants.mjs';
import { installLauncher } from './install-launcher.mjs';
import { launcherName } from './launcher-name.mjs';

const DELEGATE = 'runThreadCli';

/**
 * @param {Record<string, any>} pkg
 * @param {string} name
 * @returns {string | null} the file the package.json bin gives the name
 */
const ownBin = (pkg, name) => {
  const bin = typeof pkg.bin === 'string' ? { [String(pkg.name ?? '').replace(/^@[^/]+\//, '')]: pkg.bin } : (pkg.bin ?? {});
  return bin[name] ?? null;
};

/**
 * @param {string} rootDir the repo root, holding package.json and brock.workspace.mjs
 * @param {boolean} force
 * @returns {{ name: string, mode: 'launcher', file: string, written: boolean, fields: string[] } | { name: string, mode: 'forward', file: string, delegates: boolean }}
 */
const linkLauncher = (rootDir, force) => {
  const pkgFile = join(rootDir, 'package.json');
  if (!existsSync(pkgFile) || !existsSync(join(rootDir, WORKSPACE_FILE))) {
    throw new Error(`${rootDir} has no package.json and ${WORKSPACE_FILE}; run this at the repo root`);
  }
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  const name = launcherName(rootDir, String(pkg.name ?? '').replace(/^@[^/]+\//, ''));
  const own = ownBin(pkg, name);
  const file = own?.replace(/^\.\//, '') ?? null;
  if (file === null || file === `bin/${name}.mjs`) return { name, mode: 'launcher', ...installLauncher(rootDir, name, force) };
  const source = existsSync(join(rootDir, file)) ? readFileSync(join(rootDir, file), 'utf8') : '';
  return { name, mode: 'forward', file, delegates: source.includes(DELEGATE) };
};

export { linkLauncher };
