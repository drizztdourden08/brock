/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findWorkspaceRoot } from '../workspace.mjs';
import { KEY_FILES, REUSE_VERSION } from './build-reuse.constants.mjs';
import { contentOf, treeStamp } from './file-stamp.mjs';
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

const buildStamp = () => {
  if (!BUILD_SRC.includes(INSTALLED)) return treeStamp(BUILD_SRC);
  try {
    return `installed@${JSON.parse(readFileSync(join(dirname(BUILD_SRC), 'package.json'), 'utf8')).version}`;
  } catch {
    return treeStamp(BUILD_SRC);
  }
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
    files: dirs.flatMap(([dir, token]) => KEY_FILES.map((name) => `${token}/${name}=${contentOf(join(dir, name))}`)),
  };
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
};

export { reuseKey };
