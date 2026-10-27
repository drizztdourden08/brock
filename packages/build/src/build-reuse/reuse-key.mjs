/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findWorkspaceRoot } from '../workspace.mjs';
import { KEY_FILES, REUSE_VERSION } from './build-reuse.constants.mjs';
import { stampOf, treeStamp } from './file-stamp.mjs';

const BUILD_SRC = dirname(dirname(fileURLToPath(import.meta.url)));

const versionOf = (rootDir, name) => {
  try {
    const manifest = createRequire(join(rootDir, 'package.json')).resolve(`${name}/package.json`);
    return JSON.parse(readFileSync(manifest, 'utf8')).version ?? 'unknown';
  } catch {
    return 'missing';
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
  const dirs = [...new Set(workspace ? [rootDir, workspace] : [rootDir])];
  const parts = {
    version: REUSE_VERSION,
    target,
    node: process.version,
    build: treeStamp(BUILD_SRC),
    vite: versionOf(rootDir, 'vite'),
    electronVite: versionOf(rootDir, 'electron-vite'),
    config: configPart,
    files: dirs.flatMap((dir) => KEY_FILES.map((name) => `${join(dir, name)}=${stampOf(join(dir, name))}`)),
  };
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
};

export { reuseKey };
