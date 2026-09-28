/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { buildInstallerStub } from './build-installer-stub.mjs';
import { INSTALL_MANIFEST } from './packaging.constants.mjs';
import { artifactPrefixOf, releaseNames } from './release-names.mjs';
import { writeInstallManifest } from './write-install-manifest.mjs';

/**
 * @param {string} rootDir
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @param {{ outDir: string, version: string }} release
 * @returns {Promise<void>}
 */
const shipInstaller = async (rootDir, product, { outDir, version }) => {
  if (!product.repo) {
    console.log('brock package: no product.repo, so no downloader stub and no install.json: they read the GitHub release');
    return;
  }
  const repoUrl = `https://github.com/${product.repo.owner}/${product.repo.name}`;
  const names = releaseNames(artifactPrefixOf(product));
  const dir = join(rootDir, outDir);
  buildInstallerStub(rootDir, product, {
    manifestUrl: `${repoUrl}/releases/latest/download/${INSTALL_MANIFEST}`,
    target: join(dir, names.stub),
  });
  const lines = await writeInstallManifest({ dir, repoUrl, tag: `v${version}`, version, names });
  console.log(`brock package: wrote ${names.stub} and ${INSTALL_MANIFEST} (${lines.join(', ')})`);
};

export { shipInstaller };
