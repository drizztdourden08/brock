/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { buildInstallerStub } from '../packaging/build-installer-stub.mjs';
import { INSTALL_MANIFEST } from '../packaging/packaging.constants.mjs';
import { installerInputs } from './installer-inputs.mjs';
import {
  PREVIEW_DIR, PREVIEW_MANIFEST_URL, PREVIEW_MARK, PREVIEW_SCALE, PREVIEW_SCREENS, PREVIEW_SPLASH,
} from './installer.constants.mjs';
import { markPng } from './mark-png.mjs';
import { setupSplashPng } from './setup-splash-png.mjs';

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductConfig} config
 */
const manifestUrlOf = ({ repo }) =>
  (repo ? `https://github.com/${repo.owner}/${repo.name}/releases/latest/download/${INSTALL_MANIFEST}` : PREVIEW_MANIFEST_URL);

/**
 * @param {string} exe
 * @param {string} dir
 * @param {string[]} screens
 * @returns {string[]}  the files written
 */
const renderScreens = (exe, dir, screens) => screens.map((screen) => {
  const file = join(dir, `${screen}.png`);
  execFileSync(exe, [`--render-png=${file}`, `--screen=${screen}`, `--scale=${PREVIEW_SCALE}`]);
  if (!existsSync(file)) throw new Error(`The installer stub did not write ${file}`);
  return `${screen}.png`;
});

/**
 * @param {string} rootDir
 * @param {import('./installer-inputs.mjs').InstallerInputs} inputs
 * @returns {string | null}  the stub, or null when it cannot be built here
 */
const tryBuildStub = (rootDir, inputs) => {
  try {
    return buildInstallerStub(rootDir, inputs, manifestUrlOf(inputs.config));
  } catch (error) {
    console.error(`brock package: the downloader screens need the stub, which did not build: ${error?.message ?? error}`);
    return null;
  }
};

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<number>}  exit code
 */
const renderInstallerPreview = async (rootDir, product) => {
  if (process.platform !== 'win32') throw new Error('brock package --render-installer needs Windows: the installer is a Windows program');
  copyBrandIcons(rootDir, { product });
  const inputs = await installerInputs(rootDir, product);
  const { config, colours } = inputs;
  const dir = join(rootDir, PREVIEW_DIR);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const mark = markPng(rootDir, inputs);
  writeFileSync(join(dir, PREVIEW_MARK), mark.png);
  const splash = setupSplashPng(rootDir, inputs);
  writeFileSync(join(dir, PREVIEW_SPLASH), splash.png);
  console.log(`brock package: accent ${colours.accent}, gradient ${colours.from} ${colours.via} ${colours.to} at ${colours.angle}deg, mark from ${mark.from}, Setup splash from ${splash.from} (${inputs.splash.from} to ${inputs.splash.to}, text ${inputs.splash.ink})`);
  const exe = tryBuildStub(rootDir, inputs);
  if (!exe) return 1;
  const screens = PREVIEW_SCREENS.filter((screen) => screen !== 'licence' || config.installer.licence);
  const written = renderScreens(exe, dir, screens);
  console.log(`brock package: wrote ${[PREVIEW_MARK, PREVIEW_SPLASH, ...written].join(', ')} in ${PREVIEW_DIR}`);
  return 0;
};

export { renderInstallerPreview };
