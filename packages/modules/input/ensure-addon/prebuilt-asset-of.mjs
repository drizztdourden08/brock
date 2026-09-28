/* @layer tooling-scripts @kind logic */
import { ASSET_PREFIX, RELEASE_REPO, RELEASE_TAG_PREFIX } from './addon.constants.mjs';

/**
 * @param {import('./index.d.mts').AddonPins} pins
 * @param {string} platformArch
 * @returns {import('./index.d.mts').PrebuiltAsset}
 */
const prebuiltAssetOf = ({ addonVersion, buildKey }, platformArch) => {
  const tag = `${RELEASE_TAG_PREFIX}${addonVersion}`;
  const name = `${ASSET_PREFIX}-${addonVersion}-${buildKey}-${platformArch}.tar.gz`;
  return { tag, name, url: `https://github.com/${RELEASE_REPO}/releases/download/${tag}/${name}` };
};

export { prebuiltAssetOf };
