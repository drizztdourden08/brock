/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { renderBootFiles } from '../boot/render-boot-files.mjs';
import { clangFormatFiles } from '../gate/clang-format-files.mjs';
import { renderHandlersFiles } from '../handlers/render-handlers.mjs';
import { renderLaunchers } from '../launcher/render-launchers.mjs';
import { appScripts } from '../managed/app-scripts.mjs';
import { renderManagedFiles } from '../managed/templates.mjs';
import { pinApp } from '../upgrade/pin-app.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { shapeOf } from '../platforms/server/app-shape.mjs';
import { platformManagedFiles } from '../platforms/platform-managed-files.mjs';
import { renderWorkflows } from '../release/render-workflows.mjs';
import { WORKFLOWS_DIR } from '../release/workflows.constants.mjs';
import { renderReviewFiles } from '../review/render-review.mjs';
import { renderScreensFiles } from '../screens/render-screens.mjs';
import { renderWidgetsFiles } from '../widgets/render-widgets.mjs';
import { renderTesseraEntryFiles } from '../tessera/render-tessera-entry.mjs';
import { renderTitleBarFiles } from '../title-bar/render-title-bar.mjs';
import { renderPaletteFile } from '../tessera/render-palette.mjs';
import { renderStartupFiles } from '../startup/render-startup.mjs';
import { renderToursFiles } from '../tours/render-tours.mjs';
import { renderToolbarsFiles } from '../toolbars/render-toolbars.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { sameText, writeIfChanged } from '../write-changed.mjs';
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
  return path === MANIFEST_PATH ? sameText(withoutTimestamp(a), withoutTimestamp(b)) : sameText(a, b);
};

/**
 * @typedef {object} SyncResult
 * @property {string[]} written Files created or rewritten (empty in check mode)
 * @property {string[]} drifted Files whose content differed from the render
 * @property {{ id: string, packageName: string | null } []} missing  Module ids with no installed package
 * @property {{ id: string, package: string, version: string } []} modules
 * @property {string[]} workflows The managed workflow files, from the app root
 */

/**
 * @param {{ id: string, packageName: string | null }[]} missing
 */
const assertResolved = (missing) => {
  if (!missing.length) return;
  const names = missing.map((m) => (m.packageName ? `${m.id} (${m.packageName})` : m.id)).join(', ');
  throw new Error(`Module package not installed for: ${names}. Run pnpm install, or brock add <id>.`);
};

const upToDate = (path, current, content) => (content === null ? current === null : current !== null && sameContent(path, current, content));

/**
 * @param {string} rootDir
 * @param {{ path: string, content: string | null }[]} files null content removes the file
 * @param {boolean} check
 * @returns {{ written: string[], drifted: string[] }}
 */
const writeDrifted = (rootDir, files, check) => {
  const written = [];
  const drifted = [];
  for (const { path, content } of files) {
    const target = join(rootDir, path);
    const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
    if (upToDate(path, current, content)) continue;
    drifted.push(path);
    if (check) continue;
    if (content === null) rmSync(target);
    else writeIfChanged(target, content);
    written.push(path);
  }
  return { written, drifted };
};

/**
 * @param {import('../config.mjs').BrockConfig} config
 */
const managedFileOptions = (config) => ({ aliases: config.build?.aliases, compilerOptions: config.tsconfig?.compilerOptions });

/**
 * @param {string} rootDir
 * @param {import('../config.mjs').BrockConfig} config
 * @returns {{ path: string, content: string | null }[]} the Electron and renderer files of a windowed app
 */
const rendererSideFiles = (rootDir, config) => [
  ...renderBootFiles(rootDir),
  ...renderHandlersFiles(rootDir),
  ...renderReviewFiles(rootDir),
  ...renderScreensFiles(rootDir),
  ...renderWidgetsFiles(rootDir),
  ...renderTitleBarFiles(rootDir),
  ...renderToursFiles(rootDir),
  ...renderToolbarsFiles(rootDir),
  ...renderStartupFiles(rootDir),
  ...renderPaletteFile(rootDir, config),
  ...renderTesseraEntryFiles(rootDir),
];

/**
 * @param {string} rootDir
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ check?: boolean, onMissing?: 'throw' | 'skip' } & Partial<import('../release/workspace-workflow-inputs.mjs').WorkflowInputs>} [opts]
 * @returns {SyncResult}
 */
const syncApp = (rootDir, config, opts = {}) => {
  const { check = false, onMissing = 'throw' } = opts;
  const { modules, missing } = resolveModules(rootDir, config.modules ?? []);
  if (onMissing === 'throw') assertResolved(missing);
  const inWorkspace = findWorkspaceRoot(rootDir) !== null;
  const workflows = renderWorkflows(rootDir, config, modules, opts);
  const { windowless } = shapeOf(config.targets ?? DEFAULT_TARGETS);
  const files = [
    ...renderBrockDir({ brockVersion: OWN_PACKAGE.version, modules, generatedAt: new Date().toISOString() }).filter((file) => !windowless || file.path === MANIFEST_PATH),
    ...(windowless ? [] : rendererSideFiles(rootDir, config)),
    ...renderManagedFiles({ inWorkspace, windowless, scripts: appScripts(rootDir), ...managedFileOptions(config) }),
    ...renderLaunchers(rootDir),
    ...platformManagedFiles({ rootDir, config, modules }),
    ...clangFormatFiles(rootDir, config),
    ...workflows,
  ];
  const { written, drifted } = writeDrifted(rootDir, files, check);
  const pinned = pinApp(rootDir, OWN_PACKAGE.version, check).length > 0 ? ['package.json'] : [];
  return {
    written: check ? written : [...written, ...pinned],
    drifted: [...drifted, ...pinned],
    missing,
    modules: modules.map((m) => ({ id: m.manifest.id, package: m.packageName, version: m.version })),
    workflows: workflows.map((file) => file.path).filter((path) => path.includes(`${WORKFLOWS_DIR}/`)),
  };
};

export { syncApp, writeDrifted, OWN_PACKAGE, BROCK_VERSION };
