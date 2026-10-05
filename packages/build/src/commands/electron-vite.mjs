/* @layer tooling-scripts @kind logic */
import { writeBootFiles } from '../boot/write-boot-files.mjs';
import { ensureElectron } from '../ensure-electron.mjs';
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { prepareModules } from '../modules/prepare-modules.mjs';
import { runBin } from '../run.mjs';
import { writeWidgetsFile } from '../widgets/write-widgets.mjs';
import { writeTitleBarFile } from '../title-bar/write-title-bar.mjs';
import { writeToursFile } from '../tours/write-tours.mjs';

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
  const problem = await ensureSynced(rootDir, `brock ${mode}`);
  if (problem) {
    console.error(`brock ${mode}: ${problem}`);
    return 1;
  }
  const config = await loadBrockConfig(rootDir);
  const copied = copyBrandIcons(rootDir, config);
  if (copied?.written.length) console.log(`brock ${mode}: copied ${copied.written.length} brand icon file(s) into build/ and public/logos/`);
  await prepareModules(rootDir, config.modules);
  for (const path of writeBootFiles(rootDir)) console.log(`brock ${mode}: wrote ${path}, the boot task list changed`);
  for (const path of writeWidgetsFile(rootDir)) console.log(`brock ${mode}: wrote ${path}, the widget list changed`);
  for (const path of writeTitleBarFile(rootDir)) console.log(`brock ${mode}: wrote ${path}, the title bar item list changed`);
  for (const path of writeToursFile(rootDir)) console.log(`brock ${mode}: wrote ${path}, the tour list changed`);
  return runBin(rootDir, 'electron-vite', [mode, ...passthrough]);
};

export { runElectronVite };
