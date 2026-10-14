/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { ADDON_FILE } from './addon.constants.mjs';
import { cmakeDirOf } from './cmake-dir-of.mjs';

/**
 * @param {string} packageDir the brock-input package folder
 * @param {string} [platformArch]
 * @param {Record<string, string | undefined>} [env]
 * @returns {import('./index.d.mts').AddonPaths}
 */
const addonPathsOf = (packageDir, platformArch = `${process.platform}-${process.arch}`, env = process.env) => {
  const nativeDir = join(packageDir, 'native');
  const prebuildsDir = join(nativeDir, 'prebuilds');
  const outDir = join(prebuildsDir, platformArch);
  const thirdPartyDir = join(nativeDir, 'third_party');
  const cmakeDir = cmakeDirOf(packageDir, env);
  return {
    packageDir,
    nativeDir,
    platformArch,
    prebuildsDir,
    outDir,
    nodeFile: join(outDir, ADDON_FILE),
    markerFile: join(prebuildsDir, `.ensured-${platformArch}.json`),
    stagingDir: join(prebuildsDir, '.download'),
    thirdPartyDir,
    downloadsDir: join(thirdPartyDir, 'downloads'),
    installDir: join(thirdPartyDir, 'install', platformArch),
    cmakeDir,
    sdlBuildDir: cmakeDir ? join(cmakeDir, `sdl-${platformArch}`) : join(thirdPartyDir, `build-${platformArch}`),
    addonBuildDir: cmakeDir ? join(cmakeDir, `addon-${platformArch}`) : join(thirdPartyDir, `addon-build-${platformArch}`),
  };
};

export { addonPathsOf };
