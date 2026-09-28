/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { WIN_ARCH } from './addon.constants.mjs';
import { buildSdl3 } from './build-sdl3.mjs';
import { cmakeEnv } from './cmake-env.mjs';
import { cmakeJsBin } from './cmake-js-bin.mjs';
import { copyBuiltArtifacts } from './copy-built-artifacts.mjs';
import { fetchSdl3 } from './fetch-sdl3.mjs';

const isLocked = (err) => err instanceof Error && /EBUSY|EPERM/.test(`${Reflect.get(err, 'code') ?? ''} ${err.message}`);

const cmakeJsArgs = (paths, configDir) => {
  const args = ['build', '-d', paths.nativeDir, '-O', paths.addonBuildDir, '-B', 'Release', `--CDSDL3_DIR=${configDir.replace(/\\/g, '/')}`];
  if (process.platform === 'win32') args.push('-A', WIN_ARCH[process.arch]?.cmakePlatform ?? 'x64');
  return args;
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<import('./index.d.mts').BuildOutcome>}
 */
const buildAddon = async (job) => {
  const { paths, log } = job;
  const env = cmakeEnv();
  const cmakeJs = cmakeJsBin(paths.packageDir);
  if (!env || !cmakeJs) return 'no-toolchain';
  try {
    log('Building the addon from source. This needs CMake and a C/C++ toolchain.');
    await fetchSdl3(job);
    const configDir = buildSdl3(job, env);
    execFileSync(process.execPath, [cmakeJs, ...cmakeJsArgs(paths, configDir)], { stdio: 'inherit', cwd: paths.nativeDir, env });
    copyBuiltArtifacts(paths);
    return existsSync(paths.nodeFile) ? 'built' : 'failed';
  } catch (err) {
    if (isLocked(err)) return 'locked';
    log(`The source build failed: ${err instanceof Error ? err.message : String(err)}`);
    return 'failed';
  }
};

export { buildAddon };
