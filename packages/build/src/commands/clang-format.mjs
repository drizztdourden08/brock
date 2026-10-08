/* @layer tooling-scripts @kind logic */
import { CONFIG_FILE } from '../config.mjs';
import { runClangFormat } from '../gate/run-clang-format.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncTargets } from './sync-targets.mjs';

/**
 * @param {{ rootDir: string, check?: boolean }} ctx check lists the files that differ, rewrites none
 * @returns {Promise<number>} exit code
 */
const runClangFormatCommand = async ({ rootDir, check = false }) => {
  const apps = await syncTargets(rootDir);
  if (!apps.length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  let code = 0;
  let declared = false;
  for (const appDir of apps) {
    const entries = (await loadBrockConfig(appDir)).gate?.clangFormat ?? [];
    if (!entries.length) continue;
    declared = true;
    code = Math.max(code, runClangFormat({ appDir, entries, check }));
  }
  if (!declared) console.log('brock clang-format: no app names C sources in gate.clangFormat of brock.config.ts.');
  return code;
};

export { runClangFormatCommand };
