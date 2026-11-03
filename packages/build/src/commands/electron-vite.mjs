/* @layer tooling-scripts @kind logic */
import { afterPrewarm } from '@drizztdourden08/brock-thread';
import { ensureElectron } from '../ensure-electron.mjs';
import { ensureSynced, ensureSyncedLater } from '../freshness/ensure-synced.mjs';
import { restoreSharedBuild } from '../build-reuse/shared-build/restore-shared-build.mjs';
import { appShape } from '../platforms/server/app-shape.mjs';
import { copyBrandIcons } from '../icons/copy-brand-icons.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { prepareModules } from '../modules/prepare-modules.mjs';
import { runBin } from '../run.mjs';
import { writeGeneratedLists } from './write-generated-lists.mjs';
import { bundleAppHelperScripts } from '../helper-scripts/bundle-helper-scripts.mjs';

const restoreForDev = (mode, rootDir) => (mode === 'dev' ? restoreSharedBuild(rootDir, { log: (line) => console.log(`brock dev: ${line}`) }) : null);

/**
 * @param {'dev' | 'build'} mode
 * @param {{ rootDir: string, noSync?: boolean, passthrough?: string[], beforeStart?: () => Promise<void> }} ctx beforeStart runs once the app is synced, before electron-vite
 * @returns {Promise<number>} exit code
 */
const runElectronVite = async (mode, { rootDir, noSync = false, passthrough = [], beforeStart }) => {
  if (appShape(rootDir).windowless) {
    console.error(`brock ${mode}: this app has no window. Use brock server ${mode === 'dev' ? 'dev' : 'build'}.`);
    return 1;
  }
  await afterPrewarm(rootDir, (line) => console.log(`brock ${mode}: ${line}`));
  const electron = ensureElectron(rootDir);
  if (!electron.ok) {
    console.error(`brock ${mode}: ${electron.message}`);
    return 1;
  }
  const syncOpts = { sync: !noSync };
  const synced = mode === 'dev'
    ? await ensureSyncedLater(rootDir, 'brock dev', syncOpts)
    : { problem: await ensureSynced(rootDir, 'brock build', syncOpts), guide: () => Promise.resolve() };
  if (synced.problem) {
    console.error(`brock ${mode}: ${synced.problem}`);
    return 1;
  }
  const config = await loadBrockConfig(rootDir);
  const copied = copyBrandIcons(rootDir, config);
  if (copied?.written.length) console.log(`brock ${mode}: copied ${copied.written.length} brand icon file(s) into build/ and public/logos/`);
  await prepareModules(rootDir, config.modules);
  writeGeneratedLists(rootDir, mode);
  restoreForDev(mode, rootDir);
  await beforeStart?.();
  const guide = synced.guide().catch((error) => console.warn(`brock ${mode}: the Tessera guide did not finish: ${error?.message ?? error}`));
  const code = await bundleAppHelperScripts(rootDir, config, `brock ${mode}`).then((bundled) => (bundled ? runBin(rootDir, 'electron-vite', [mode, ...passthrough]) : 1));
  await guide;
  return code;
};

export { runElectronVite };
