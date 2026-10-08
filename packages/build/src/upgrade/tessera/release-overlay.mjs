/* @layer tooling-scripts @kind logic */
import { RENAME_MAPS } from './tessera-renames.constants.mjs';

/**
 * @param {Record<string, any>} release one RENAMES.json release
 * @param {Record<string, Record<string, any>>} overlay by version, maps whose entries replace the release's own
 * @returns {Record<string, any>} the release with the overlay's entries for its version
 */
const releaseOverlay = (release, overlay) => {
  const extra = overlay[release.version];
  if (!extra) return release;
  return RENAME_MAPS.filter((group) => extra[group]).reduce((merged, group) => ({ ...merged, [group]: { ...release[group], ...extra[group] } }), release);
};

export { releaseOverlay };
