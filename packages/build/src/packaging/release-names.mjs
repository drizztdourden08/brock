/* @layer tooling-scripts @kind logic */

/**
 * @param {{ id: string, artifactPrefix?: string }} product
 */
const artifactPrefixOf = (product) => product.artifactPrefix ?? `${product.id}-`;

/**
 * @param {string} prefix
 * @returns {{ stub: string, payload: string, directory: string, appImage: string }}
 */
const releaseNames = (prefix) => ({
  stub: `${prefix}windows-setup.exe`,
  payload: `${prefix}windows-payload.exe`,
  directory: `${prefix}windows-directory.zip`,
  appImage: `${prefix}linux.AppImage`,
});

export { artifactPrefixOf, releaseNames };
