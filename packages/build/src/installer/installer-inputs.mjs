/* @layer tooling-scripts @kind logic */
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { appLook } from '../look/app-look.mjs';
import { themePalette } from '../look/theme-palette.mjs';
import { installerTheme } from './installer-theme.mjs';
import { stubColours } from './stub-colours.mjs';

/**
 * @typedef {object} InstallerInputs
 * @property {import('@drizztdourden08/brock-core/product').ProductConfig} config
 * @property {import('@drizztdourden08/brock-core/look').ResolvedLook} look
 * @property {import('./stub-colours.mjs').StubColours} colours
 * @property {string} tesseraRoot  the installed Tessera package folder
 */

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<InstallerInputs>}  the config, look and colours the installer reads
 */
const installerInputs = async (rootDir, product) => {
  const { config, look } = await appLook(rootDir, product);
  const tesseraRoot = tesseraDir(rootDir);
  return { config, look, colours: stubColours(look, installerTheme(tesseraRoot, themePalette(rootDir, config.icons.brand))), tesseraRoot };
};

export { installerInputs };
