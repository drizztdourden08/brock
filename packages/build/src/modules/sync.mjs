/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderBootFiles } from '../boot/render-boot-files.mjs';
import { renderHandlersFiles } from '../handlers/render-handlers.mjs';
import { renderLaunchers } from '../launcher/render-launchers.mjs';
import { renderManagedFiles } from '../managed/templates.mjs';
import { pinApp } from '../upgrade/pin-app.mjs';
import { platformManagedFiles } from '../platforms/platform-managed-files.mjs';
import { renderWorkflows } from '../release/render-workflows.mjs';
import { renderReviewFiles } from '../review/render-review.mjs';
import { renderScreensFiles } from '../screens/render-screens.mjs';
import { renderWidgetsFiles } from '../widgets/render-widgets.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { renderBrockDir } from './generate.mjs';
import { resolveModules } from './resolve.mjs';

const OWN_PACKAGE = JSON.parse(readFileSync(join(import.meta.dirname, '../../package.json'), 'utf8'));
const BROCK_VERSION = OWN_PACKAGE.version;
const MANIFEST_PATH = '.brock/manifest.json';

/**
 * @param {string} content
 */
const withoutTimestamp = (content) => {
  try {
    const entries = Object.entries(JSON.parse(content)).filter(([key]) => key !== 'generatedAt');
    return JSON.stringify(Object.fromEntries(entries));
  } catch {
    return content;
  }
};

/**
 * @param {string} path @param {string} a @param {string} b
 */
const sameContent = (path, a, b) => {
  const left = a.replace(/\r\n/g, '\n');
  const right = b.replace(/\r\n/g, '\n');
  return path === MANIFEST_PATH ? withoutTimestamp(left) === withoutTimestamp(right) : left === right;
};

/**
 * @typedef {object} SyncResult
 * @property {string[]} written Files created or rewritten (empty in check mode)
 * @property {string[]} drifted Files whose content differed from the render
 * @property {{ id: string, packageName: string | null } []} missing  Module ids with no installed package
 * @property {{ id: string, package: string, version: string } []} modules
 */

/**
 * @param {{ id: string, packageName: string | null }[]} missing
 */
const assertResolved = (missing) => {
  if (!missing.length) return;
  const names = missing.map((m) => (m.packageName ? `${m.id} (${m.packageName})` : m.id)).join(', ');
  throw new Error(`Module package not installed for: ${names}. Run pnpm install, or brock add <id>.`);
};

/**
 * @param {string} rootDir
 * @param {{ path: string, content: string }[]} files
 * @param {boolean} check
 * @returns {{ written: string[], drifted: string[] }}
 */
const writeDrifted = (rootDir, files, check) => {
  const written = [];
  const drifted = [];
  for (const { path, content } of files) {
    const target = join(rootDir, path);
    const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
    if (current !== null && sameContent(path, current, content)) continue;
    drifted.push(path);
    if (check) continue;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
    written.push(path);
  }
  return { written, drifted };
};

/**
 * @param {string} rootDir
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ check?: boolean, onMissing?: 'throw' | 'skip'}} [opts]
 * @returns {SyncResult}
 */
const syncApp = (rootDir, config, opts = {}) => {
  const { check = false, onMissing = 'throw' } = opts;
  const { modules, missing } = resolveModules(rootDir, config.modules ?? []);
  if (onMissing === 'throw') assertResolved(missing);
  const inWorkspace = findWorkspaceRoot(rootDir) !== null;
  const files = [
    ...renderBrockDir({ brockVersion: OWN_PACKAGE.version, modules, generatedAt: new Date().toISOString() }),
    ...renderBootFiles(rootDir),
    ...renderHandlersFiles(rootDir),
    ...renderReviewFiles(rootDir),
    ...renderScreensFiles(rootDir),
    ...renderWidgetsFiles(rootDir),
    ...renderManagedFiles({ inWorkspace }),
    ...renderLaunchers(rootDir),
    ...platformManagedFiles({ rootDir, config, modules }),
    ...(inWorkspace ? [] : renderWorkflows(config, modules)),
  ];
  const { written, drifted } = writeDrifted(rootDir, files, check);
  const pinned = pinApp(rootDir, OWN_PACKAGE.version, check).length > 0 ? ['package.json'] : [];
  return {
    written: check ? written : [...written, ...pinned],
    drifted: [...drifted, ...pinned],
    missing,
    modules: modules.map((m) => ({ id: m.manifest.id, package: m.packageName, version: m.version })),
  };
};

export { syncApp, OWN_PACKAGE, BROCK_VERSION };
