/* @layer tooling-scripts @kind logic */
import { ensureElectron } from '../ensure-electron.mjs';
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { prepareModules } from '../modules/prepare-modules.mjs';
import { runBin } from '../run.mjs';

/**
 * @param {'dev' | 'build'} mode
 * @param {{ rootDir: string, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runElectronVite = async (mode, { rootDir, passthrough = [] }) => {
  const electron = ensureElectron(rootDir);
  if (!electron.ok) {
    console.error(`brock ${mode}: ${electron.message}`);
    return 1;
  }
  const config = await loadBrockConfig(rootDir);
  const copied = copyBrandIcons(rootDir, config);
  if (copied?.written.length) console.log(`brock ${mode}: copied ${copied.written.length} brand icon file(s) into build/ and public/logos/`);
  await prepareModules(rootDir, config.modules);
  return runBin(rootDir, 'electron-vite', [mode, ...passthrough]);
};

export { runElectronVite };
