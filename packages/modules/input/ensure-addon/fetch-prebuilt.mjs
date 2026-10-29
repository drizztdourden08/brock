/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { downloadFile } from './download-file.mjs';
import { extractArchive } from './extract-archive.mjs';
import { isLocalMode } from './local-mode.mjs';
import { cachedPrebuiltOf, storePrebuilt } from './prebuilt-cache.mjs';
import { prebuiltAssetOf } from './prebuilt-asset-of.mjs';
import { verifySidecar } from './verify-sidecar.mjs';

const unpack = (archive, outDir, name) => {
  if (!extractArchive(archive, outDir)) throw new Error(`tar could not unpack ${name}`);
};

const download = async ({ paths, env, log }, asset) => {
  const archive = join(paths.stagingDir, asset.name);
  const head = await fetch(asset.url, { method: 'HEAD' });
  if (head.status === 404) return 'absent';
  log(`Downloading ${asset.name} from the ${asset.tag} release.`);
  await downloadFile(asset.url, archive);
  const verified = await verifySidecar(asset.url, archive, log);
  if (verified && await storePrebuilt(asset, paths.platformArch, archive, env)) log(`Cached ${asset.name} for the next install.`);
  unpack(archive, paths.outDir, asset.name);
  return 'installed';
};

/**
 * @param {Omit<import('./index.d.mts').AddonJob, 'force'>} job
 * @returns {Promise<import('./index.d.mts').FetchOutcome>} offline: not cached, local mode
 */
const fetchPrebuilt = async (job) => {
  const { paths, pins, env, log } = job;
  const asset = prebuiltAssetOf(pins, paths.platformArch);
  try {
    const cached = cachedPrebuiltOf(asset, paths.platformArch, env);
    if (cached) {
      log(`Using ${asset.name} from the build cache.`);
      unpack(cached, paths.outDir, asset.name);
      return 'installed';
    }
    if (isLocalMode(env)) {
      log(`${asset.name} is not cached and local mode forbids downloading it.`);
      return 'offline';
    }
    return await download(job, asset);
  } catch (err) {
    log(`Could not install the prebuilt for ${paths.platformArch}: ${err instanceof Error ? err.message : String(err)}`);
    return 'failed';
  } finally {
    if (existsSync(paths.stagingDir)) rmSync(paths.stagingDir, { recursive: true, force: true });
  }
};

export { fetchPrebuilt };
