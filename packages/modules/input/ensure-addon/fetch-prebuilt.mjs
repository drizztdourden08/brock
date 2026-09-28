/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { downloadFile } from './download-file.mjs';
import { extractArchive } from './extract-archive.mjs';
import { prebuiltAssetOf } from './prebuilt-asset-of.mjs';
import { verifySidecar } from './verify-sidecar.mjs';

/**
 * @param {Omit<import('./index.d.mts').AddonJob, 'force'>} job
 * @returns {Promise<import('./index.d.mts').FetchOutcome>} absent: no asset for this build yet
 */
const fetchPrebuilt = async ({ paths, pins, log }) => {
  const asset = prebuiltAssetOf(pins, paths.platformArch);
  const archive = join(paths.stagingDir, asset.name);
  try {
    const head = await fetch(asset.url, { method: 'HEAD' });
    if (head.status === 404) return 'absent';
    log(`Downloading ${asset.name} from the ${asset.tag} release.`);
    await downloadFile(asset.url, archive);
    await verifySidecar(asset.url, archive, log);
    if (!extractArchive(archive, paths.outDir)) throw new Error(`tar could not unpack ${asset.name}`);
    return 'installed';
  } catch (err) {
    log(`Could not install the prebuilt for ${paths.platformArch}: ${err instanceof Error ? err.message : String(err)}`);
    return 'failed';
  } finally {
    if (existsSync(paths.stagingDir)) rmSync(paths.stagingDir, { recursive: true, force: true });
  }
};

export { fetchPrebuilt };
