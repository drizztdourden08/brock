/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { copyLibusbRuntime } from './copy-libusb-runtime.mjs';
import { readJson } from './read-json.mjs';
import { sdl3ConfigDir } from './sdl3-config-dir.mjs';
import { sdl3ConfigureArgs } from './sdl3-configure-args.mjs';

const isBuilt = ({ paths, pins }, markerFile) => {
  const marker = readJson(markerFile);
  return Boolean(marker)
    && marker.sdl3Version === pins.sdl3Version
    && marker.libusbVersion === pins.libusbVersion
    && marker.platformArch === paths.platformArch
    && marker.hidapiLibusb === true
    && sdl3ConfigDir(paths.installDir) !== null;
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @param {NodeJS.ProcessEnv} env PATH may carry the Visual Studio cmake
 * @returns {string} the folder holding SDL3Config.cmake
 */
const buildSdl3 = (job, env) => {
  const { paths, pins, force, log } = job;
  const markerFile = join(paths.thirdPartyDir, 'install', `.built-${paths.platformArch}.json`);
  const configDir = sdl3ConfigDir(paths.installDir);
  if (configDir && !force && isBuilt(job, markerFile)) return configDir;
  log(`Building SDL ${pins.sdl3Version} with SDL_HIDAPI_LIBUSB=ON for ${paths.platformArch}.`);
  const cmake = (args) => execFileSync('cmake', args, { cwd: paths.nativeDir, stdio: 'inherit', env });
  mkdirSync(paths.sdlBuildDir, { recursive: true });
  cmake(sdl3ConfigureArgs(join(paths.thirdPartyDir, `SDL3-${pins.sdl3Version}`), job));
  cmake(['--build', paths.sdlBuildDir, '--config', 'Release', '--parallel']);
  cmake(['--install', paths.sdlBuildDir, '--config', 'Release']);
  copyLibusbRuntime(job);
  const installed = sdl3ConfigDir(paths.installDir);
  if (!installed) throw new Error(`The SDL build finished but installed no SDL3Config.cmake under ${paths.installDir}.`);
  mkdirSync(dirname(markerFile), { recursive: true });
  const marker = { sdl3Version: pins.sdl3Version, libusbVersion: pins.libusbVersion, platformArch: paths.platformArch, hidapiLibusb: true, builtAt: new Date().toISOString() };
  writeFileSync(markerFile, `${JSON.stringify(marker, null, 2)}\n`);
  return installed;
};

export { buildSdl3 };
