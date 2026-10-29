/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { findWorkspaceRoot } from '../../workspace.mjs';
import { preflightConfig } from '../config-key.mjs';
import { reuseKey } from '../reuse-key.mjs';
import { SHARED_VERSION, UNSAFE_SEGMENT } from './shared-build.constants.mjs';

const manifestOf = (rootDir) => {
  try {
    return JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  } catch {
    return {};
  }
};

const segment = (text, fallback) => String(text ?? '').replace(UNSAFE_SEGMENT, '_') || fallback;

/**
 * @typedef {{ path: string, name: string, version: string }} AppIdentity
 */

/**
 * @param {string} rootDir the app root
 * @param {import('../repo-snapshot.mjs').RepoSnapshot | null} snapshot
 * @returns {AppIdentity} the app path in its workspace, its package name and version
 */
const identityOf = (rootDir, snapshot) => {
  const base = findWorkspaceRoot(rootDir) ?? snapshot?.top ?? rootDir;
  const manifest = manifestOf(rootDir);
  return { path: relative(base, rootDir).split(sep).join('/') || '.', name: segment(manifest.name, 'app'), version: segment(manifest.version, '0.0.0') };
};

/**
 * @param {string} rootDir the app root
 * @param {string} target main or preload
 * @param {AppIdentity} identity
 * @returns {string} a hash of everything but the source files, read without Vite
 */
const sharedEnvKey = (rootDir, target, identity) => {
  const parts = {
    shared: SHARED_VERSION,
    reuse: reuseKey(rootDir, target, preflightConfig(rootDir)),
    app: identity.path,
    name: identity.name,
    platform: `${process.platform}-${process.arch}`,
  };
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
};

export { identityOf, sharedEnvKey };
