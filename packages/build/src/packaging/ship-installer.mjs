/* @layer tooling-scripts @kind logic */
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildInstallerStub } from './build-installer-stub.mjs';
import { INSTALL_MANIFEST } from './packaging.constants.mjs';
import { artifactPrefixOf, releaseNames } from './release-names.mjs';
import { writeInstallManifest } from './write-install-manifest.mjs';

/**
 * @param {string} rootDir
 * @param {import('../installer/installer-inputs.mjs').InstallerInputs} inputs
 * @param {{ outDir: string, version: string }} release
 * @returns {Promise<void>}
 */
const shipInstaller = async (rootDir, inputs, { outDir, version }) => {
  const { config } = inputs;
  if (!config.repo) {
    console.log('brock package: no product.repo, so no downloader stub and no install.json: they read the GitHub release');
    return;
  }
  const repoUrl = `https://github.com/${config.repo.owner}/${config.repo.name}`;
  const names = releaseNames(artifactPrefixOf(config));
  const dir = join(rootDir, outDir);
  copyFileSync(buildInstallerStub(rootDir, inputs, `${repoUrl}/releases/latest/download/${INSTALL_MANIFEST}`), join(dir, names.stub));
  const lines = await writeInstallManifest({ dir, repoUrl, tag: `v${version}`, version, names });
  console.log(`brock package: wrote ${names.stub} and ${INSTALL_MANIFEST} (${lines.join(', ')})`);
};

export { shipInstaller };
