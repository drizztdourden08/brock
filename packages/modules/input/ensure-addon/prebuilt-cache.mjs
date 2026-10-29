/* @layer tooling-scripts @kind logic */
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIND, cacheRoot, commitEntry, readEntry, touchEntry } from '@drizztdourden08/build-cache/store';
import { sha256File } from './sha256-file.mjs';

const entryIdOf = (asset, platformArch, env) => ({
  root: cacheRoot(env),
  kind: KIND.ADDON_PREBUILT,
  name: asset.name,
  version: asset.tag,
  buildKey: platformArch,
});

/**
 * @param {import('./index.d.mts').PrebuiltAsset} asset
 * @param {string} platformArch
 * @param {Record<string, string | undefined>} env BROCK_BUILD_CACHE_DIR picks the cache root
 * @returns {string | null} the cached archive, null on a miss
 */
const cachedPrebuiltOf = (asset, platformArch, env) => {
  try {
    const entry = readEntry(entryIdOf(asset, platformArch, env), { verify: false });
    if (!entry) return null;
    const archive = join(entry.filesDir, asset.name);
    if (sha256File(archive) !== entry.manifest.archiveSha256) return null;
    touchEntry(entry);
    return archive;
  } catch {
    return null;
  }
};

/**
 * @param {import('./index.d.mts').PrebuiltAsset} asset
 * @param {string} platformArch
 * @param {string} archive a downloaded archive whose digest was verified
 * @param {Record<string, string | undefined>} env
 * @returns {Promise<boolean>} false when the cache could not store it
 */
const storePrebuilt = async (asset, platformArch, archive, env) => {
  try {
    const archiveSha256 = sha256File(archive);
    await commitEntry({
      ...entryIdOf(asset, platformArch, env),
      fill: async (filesDir) => {
        copyFileSync(archive, join(filesDir, asset.name));
        return { archiveSha256 };
      },
    });
    return true;
  } catch {
    return false;
  }
};

export { cachedPrebuiltOf, storePrebuilt };
