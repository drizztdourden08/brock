/* @layer tooling-scripts @kind logic */
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { builderIconProblem } from './builder-icons.mjs';

/**
 * @param {string} rootDir the app root
 * @param {import('../config.mjs').BrockConfig} config
 * @param {NodeJS.Platform} platform
 * @returns {string | null} why the icon would be Electron's, or null
 */
const preparePackageIcons = (rootDir, config, platform) => {
  const copied = copyBrandIcons(rootDir, config);
  if (copied?.written.length) console.log(`brock package: copied ${copied.written.length} brand icon file(s) into build/ and public/logos/`);
  return builderIconProblem(rootDir, config.product?.icons, platform);
};

export { preparePackageIcons };
