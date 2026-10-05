/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { brandRim } from '../icons/brand-rim.mjs';
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { installerInputs } from '../installer/installer-inputs.mjs';
import { writeSetupSplash } from '../installer/write-setup-splash.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { expandTargets } from '../platforms/expand-targets.mjs';

/**
 * @param {string} rootDir The app root
 * @param {import('../config.mjs').BrockConfig} config
 * @returns {Promise<string | null>} the Setup splash, or null without Windows
 */
const drawSetupSplash = async (rootDir, config) => {
  if (!expandTargets(config.targets).platforms.includes('windows')) return null;
  return writeSetupSplash(rootDir, await installerInputs(rootDir, config.product));
};

/**
 * @param {{ rootDir: string, force?: boolean }} ctx
 * @returns {Promise<number>} exit code
 */
const runIcons = async ({ rootDir, force = false }) => {
  const config = await loadBrockConfig(rootDir);
  const label = relative(process.cwd(), rootDir) || '.';
  const result = copyBrandIcons(rootDir, config, { force });
  const splash = await drawSetupSplash(rootDir, config);
  if (splash) console.log(`brock icons: drew ${splash} on the dark ground in ${label}`);
  if (!result) {
    console.log(`brock icons: ${label} sets no icons.brand; the icon path fields are used as written.`);
    return 0;
  }
  if (!result.written.length) {
    const rim = brandRim(config.product.icons);
    console.log(`brock icons: ${label} already carries the ${config.product.icons.brand}${rim ? ` ${rim}-rim` : ''} set (${result.current.length} file(s), --force recopies).`);
    return 0;
  }
  console.log(`brock icons: wrote ${result.written.length} file(s) from ${result.brandDir} in ${label}:`);
  for (const path of result.written) console.log(`  ${path}`);
  if (result.current.length) console.log(`  ${result.current.length} file(s) already current`);
  return 0;
};

export { runIcons };
