/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashTree } from '@drizztdourden08/build-cache/store';
import { portableLockfile } from '../shared-deps-cache/portable-lockfile.mjs';
import { PNPM_LOCKFILE } from '../shared-deps-cache/shared-deps-cache.constants.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { KEY_FILES, REUSE_VERSION } from './build-reuse.constants.mjs';
import { contentOf } from './file-stamp.mjs';
import { portableValue } from './portable-value.mjs';

const BUILD_SRC = dirname(dirname(fileURLToPath(import.meta.url)));
const INSTALLED = `${sep}node_modules${sep}`;

const versionOf = (rootDir, name) => {
  try {
    const manifest = createRequire(join(rootDir, 'package.json')).resolve(`${name}/package.json`);
    return JSON.parse(readFileSync(manifest, 'utf8')).version ?? 'unknown';
  } catch {
    return 'missing';
  }
};

const sourceStamp = () => `source:${hashTree(BUILD_SRC).contentHash}`;

const computeStamp = () => {
  if (!BUILD_SRC.includes(INSTALLED)) return sourceStamp();
  try {
    return `installed@${JSON.parse(readFileSync(join(dirname(BUILD_SRC), 'package.json'), 'utf8')).version}`;
  } catch {
    return sourceStamp();
  }
};

const lockfileStamp = (dir) => {
  const file = join(dir, PNPM_LOCKFILE);
  try {
    const text = readFileSync(file, 'utf8');
    const portable = portableLockfile(text, dir);
    return portable === text ? contentOf(file) : `portable:${createHash('sha256').update(portable).digest('hex').slice(0, 24)}`;
  } catch {
    return null;
  }
};

const keyFileStamp = (dir, name) => (name === PNPM_LOCKFILE ? lockfileStamp(dir) : contentOf(join(dir, name)));

let stamped = null;

const buildStamp = () => {
  stamped ??= computeStamp();
  return stamped;
};

/**
 * @param {string} rootDir the app root
 * @param {string} target main or preload
 * @param {Record<string, unknown>} [configPart] what configKey gave
 * @returns {string} a hash of the build code, tools, config and installs
 */
const reuseKey = (rootDir, target, configPart = {}) => {
  const workspace = findWorkspaceRoot(rootDir);
  const dirs = [[rootDir, '<app>'], ...(workspace && workspace !== rootDir ? [[workspace, '<workspace>']] : [])];
  const parts = {
    version: REUSE_VERSION,
    target,
    node: process.version,
    build: buildStamp(),
    vite: versionOf(rootDir, 'vite'),
    electronVite: versionOf(rootDir, 'electron-vite'),
    config: portableValue(configPart, dirs),
    files: dirs.flatMap(([dir, token]) => KEY_FILES.map((name) => `${token}/${name}=${keyFileStamp(dir, name)}`)),
  };
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
};

export { reuseKey };
