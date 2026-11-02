/* @layer tooling-scripts @kind logic */
import { localpkgStatus, neededIn, resolveBinary } from '../replay/replay-localpkg.mjs';
import { manifestsAt } from './commit-manifests.mjs';

const NOT_FOUND = '--localpkg needs localpkg and none was found: LOCALPKG_BIN is unset and localpkg is not on the PATH. Set LOCALPKG_BIN to the localpkg script.';

const buildOf = (need, built) => ({ name: need.name, version: need.version, head: built.get(need.name)?.head ?? null, unmerged: built.get(need.name)?.unmerged === true });

/**
 * @param {{ exec: Function, cwd: string, sha: string }} input exec is the runner seam, sha the commit under test
 * @returns {{ binary: object, exec: Function, builds: { name: string, version: string, head: string | null, unmerged: boolean }[] }} the localpkg a --localpkg run uses
 */
const localpkgRequest = ({ exec, cwd, sha }) => {
  const binary = resolveBinary(exec, cwd);
  if (!binary) throw new Error(NOT_FOUND);
  const status = localpkgStatus(exec, cwd, binary);
  const built = new Map(status.builds.map((build) => [build.name, build]));
  const builds = neededIn({ manifests: manifestsAt({ exec, cwd, sha }), status }).map((need) => buildOf(need, built));
  return { binary, exec, builds: builds.sort((a, b) => a.name.localeCompare(b.name)) };
};

export { localpkgRequest };
