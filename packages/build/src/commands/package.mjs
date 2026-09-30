/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { installerInputs } from '../installer/installer-inputs.mjs';
import { renderInstallerPreview } from '../installer/render-installer-preview.mjs';
import { writeSetupSplash } from '../installer/write-setup-splash.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { namePackOutputs } from '../packaging/name-pack-outputs.mjs';
import {
  BUILDER_CONFIG_FILE, BUILDER_TARGETS, NOTES_DIR, RELEASE_DIR, UNPACKED_DIRS, VELOPACK_OUT,
} from '../packaging/packaging.constants.mjs';
import { artifactPrefixOf } from '../packaging/release-names.mjs';
import { runVpk } from '../packaging/run-vpk.mjs';
import { shipInstaller } from '../packaging/ship-installer.mjs';
import { vpkPackArgs } from '../packaging/vpk-args.mjs';
import { runBin } from '../run.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { runBuild } from './build.mjs';

/**
 * @param {string} rootDir
 * @param {string} version
 * @returns {string | null} the notes file, relative to the app root
 */
const releaseNotesFor = (rootDir, version) => {
  const roots = [rootDir, findWorkspaceRoot(rootDir)].filter(Boolean);
  const found = roots.map((dir) => join(dir, NOTES_DIR, `v${version}.md`)).find((file) => existsSync(file));
  return found ? relative(rootDir, found) : null;
};

/**
 * @param {string} rootDir
 * @param {string} platform
 */
const runBuilder = (rootDir, platform) =>
  runBin(rootDir, 'electron-builder', [...BUILDER_TARGETS[platform], '--publish', 'never', '--config', BUILDER_CONFIG_FILE]);

/**
 * @param {string} rootDir
 * @param {import('../installer/installer-inputs.mjs').InstallerInputs | null} inputs
 */
const windowsExtras = (rootDir, inputs) =>
  (inputs ? { splash: writeSetupSplash(rootDir, inputs), accent: inputs.colours.accent, installer: inputs.config.installer } : {});

/**
 * @param {{ rootDir: string, platform: string, product: object, version: string }} app
 * @param {{ full: boolean, channel: string | null }} opts
 * @returns {Promise<number>}
 */
const packVelopack = async ({ rootDir, platform, product, version }, { full, channel }) => {
  const inputs = platform === 'win32' ? await installerInputs(rootDir, product) : null;
  const extras = { ...windowsExtras(rootDir, inputs), notes: releaseNotesFor(rootDir, version), channel, full };
  const packDir = join(RELEASE_DIR, UNPACKED_DIRS[platform]);
  const code = await runVpk(rootDir, vpkPackArgs({ product, version, platform, packDir, outputDir: VELOPACK_OUT, extras }));
  if (code !== 0) return code;
  const naming = { id: product.id, prefix: artifactPrefixOf(product), platform, channel, full };
  const named = namePackOutputs(join(rootDir, VELOPACK_OUT), naming);
  console.log(`brock package: packed ${version}${channel ? ` (${channel})` : ''} into ${VELOPACK_OUT}: the update package${named.length ? `, ${named.join(', ')}` : ''}`);
  if (inputs) await shipInstaller(rootDir, inputs, { outDir: VELOPACK_OUT, version });
  return 0;
};

/**
 * @param {{ rootDir: string, full?: boolean, channel?: string, renderInstaller?: boolean, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runPackage = async ({ rootDir, full = false, channel, renderInstaller, passthrough = [] }) => {
  const platform = process.platform;
  if (!BUILDER_TARGETS[platform]) throw new Error(`brock package does not know how to package on ${platform}`);
  const { product } = await loadBrockConfig(rootDir);
  if (renderInstaller) return renderInstallerPreview(rootDir, product);
  const version = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')).version;
  const built = await runBuild({ rootDir, passthrough });
  if (built !== 0) return built;
  const packaged = await runBuilder(rootDir, platform);
  if (packaged !== 0 || !UNPACKED_DIRS[platform]) return packaged;
  return packVelopack({ rootDir, platform, product, version }, { full, channel: channel ?? product.updateChannel ?? null });
};

export { runPackage };
