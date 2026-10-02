/* @layer tooling-scripts @kind logic */
import { compareVersions } from '@drizztdourden08/brock-thread';
import { NEXT_RELEASE } from './tessera-renames.constants.mjs';

const inRange = (version, { from, to }) => compareVersions(version, from) > 0 && compareVersions(version, to) <= 0;

/**
 * @param {Record<string, any>[]} releases RENAMES.json releases, oldest first
 * @param {{ from: string, to: string }} range from excluded, to included; next always replays
 * @returns {Record<string, any>[]} the releases to replay, oldest first
 */
const selectReleases = (releases, range) =>
  releases.filter(({ version }) => version === NEXT_RELEASE || (typeof version === 'string' && inRange(version, range)));

export { selectReleases };
