/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_DEFAULTS } from './linux.constants.mjs';

/**
 * @typedef {object} LinuxShare
 * @property {string} name the share and the folder name under the VM user's home
 * @property {string} path the host folder, from the repo root
 */

/**
 * @typedef {object} LinuxSettings
 * @property {string} repoName the workspace name, the folder the VM keeps its copy in
 * @property {string} appDir the app folder, from the repo root
 * @property {string[]} build the build command, run in the app folder
 * @property {string} artifactDir where the build leaves the AppImage, from the app folder
 * @property {LinuxShare[]} shares extra host folders the VM mounts before the launch
 * @property {string[]} launchFlags
 * @property {{ id: string, name: string }} product
 * @property {string | null} icon the app icon on the host
 */

const slashed = (path) => path.replace(/\\/g, '/');

const firstElectronApp = (workspace, rootDir) => {
  const checkout = { name: 'main', path: rootDir, main: rootDir };
  const target = Object.values(workspace.targets ?? {}).find((entry) => entry?.kind === 'electron' && typeof entry.appDir === 'function');
  return target ? slashed(relative(rootDir, target.appDir(checkout))) || '.' : '.';
};

const commandOf = (value, fallback) => {
  if (value === undefined) return [...fallback];
  if (!Array.isArray(value) || value.length === 0 || value.some((word) => typeof word !== 'string')) {
    throw new Error('workspace.linux.build must be a non-empty command array, like ["pnpm", "exec", "brock", "package"].');
  }
  return value;
};

const sharesOf = (value = []) => value.map((share) => {
  if (!share || typeof share.name !== 'string' || !/^[\w-]+$/.test(share.name) || typeof share.path !== 'string') {
    throw new Error('workspace.linux.shares entries are { name, path }: a plain name and a folder from the repo root.');
  }
  return { name: share.name, path: share.path };
});

/**
 * @param {string} appRoot
 * @param {string} fallback
 * @returns {Promise<{ id: string, name: string }>}
 */
const productOf = async (appRoot, fallback) => {
  const file = join(appRoot, 'brock.config.ts');
  if (!existsSync(file)) return { id: fallback, name: fallback };
  try {
    const { product } = (await import(pathToFileURL(file).href)).default;
    return { id: product.id ?? fallback, name: product.name ?? fallback };
  } catch {
    return { id: fallback, name: fallback };
  }
};

/**
 * @param {string} rootDir the main checkout
 * @param {{ name: string, targets?: object, linux?: Record<string, any> }} workspace
 * @returns {Promise<LinuxSettings>}
 */
const linuxSettings = async (rootDir, workspace) => {
  const linux = workspace.linux ?? {};
  const appDir = typeof linux.app === 'string' ? slashed(linux.app) : firstElectronApp(workspace, rootDir);
  const appRoot = resolve(rootDir, appDir);
  const icon = join(appRoot, 'public', 'logos', 'icon-256.png');
  return {
    repoName: workspace.name,
    appDir,
    build: commandOf(linux.build, REPO_DEFAULTS.build),
    artifactDir: typeof linux.artifactDir === 'string' ? linux.artifactDir : REPO_DEFAULTS.artifactDir,
    shares: sharesOf(linux.shares),
    launchFlags: Array.isArray(linux.launchFlags) ? linux.launchFlags : [...REPO_DEFAULTS.launchFlags],
    product: await productOf(appRoot, workspace.name),
    icon: existsSync(icon) ? icon : null,
  };
};

export { linuxSettings };
