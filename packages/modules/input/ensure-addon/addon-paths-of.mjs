/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { ADDON_FILE } from './addon.constants.mjs';

/**
 * @param {string} packageDir the brock-input package folder
 * @param {string} [platformArch]
 * @returns {import('./index.d.mts').AddonPaths}
 */
const addonPathsOf = (packageDir, platformArch = `${process.platform}-${process.arch}`) => {
  const nativeDir = join(packageDir, 'native');
  const prebuildsDir = join(nativeDir, 'prebuilds');
  const outDir = join(prebuildsDir, platformArch);
  const thirdPartyDir = join(nativeDir, 'third_party');
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
    sdlBuildDir: join(thirdPartyDir, `build-${platformArch}`),
    addonBuildDir: join(thirdPartyDir, `addon-build-${platformArch}`),
  };
};

export { addonPathsOf };
