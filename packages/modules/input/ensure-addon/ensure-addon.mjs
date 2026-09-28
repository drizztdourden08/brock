/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { addonPathsOf } from './addon-paths-of.mjs';
import { buildAddon } from './build-addon.mjs';
import { fetchPrebuilt } from './fetch-prebuilt.mjs';
import { readAddonState } from './read-addon-state.mjs';
import { readJson } from './read-json.mjs';
import { readPins } from './read-pins.mjs';
import { writeMarker } from './write-marker.mjs';
import { BUILD_HINT } from './addon.constants.mjs';

const buildLocally = async (job) => {
  const outcome = await buildAddon(job);
  if (outcome === 'built') writeMarker(job.paths, job.pins, 'local');
  if (outcome === 'locked') job.log('The new build is in use by a running app and could not be installed. Close the app and run this again.');
  return outcome;
};

const forceBuild = async (job) => {
  job.log(`Building from source for ${job.paths.platformArch}, ignoring any published prebuilt.`);
  const outcome = await buildLocally(job);
  return outcome === 'built' ? 'built' : 'failed';
};

const installPrebuilt = async (job) => {
  const fetched = await fetchPrebuilt(job);
  if (fetched === 'installed') writeMarker(job.paths, job.pins, 'prebuilt');
  if (fetched === 'absent') job.log(`No published build of v${job.pins.addonVersion} for ${job.paths.platformArch} yet.`);
  return fetched;
};

const fallback = async (job, allowBuild) => {
  const outcome = allowBuild ? await buildLocally(job) : 'no-toolchain';
  if (outcome === 'built') return 'built';
  if (existsSync(job.paths.nodeFile)) {
    job.log('Keeping the addon already on disk.');
    return 'kept';
  }
  job.log(`Controllers stay off until the SDL3 addon is present. ${allowBuild ? 'A source build needs CMake, a C/C++ toolchain and the cmake-js dev dependency.' : BUILD_HINT}`);
  return 'unavailable';
};

const hasLocalBuild = (paths) => existsSync(paths.nodeFile) && readJson(paths.markerFile)?.source === 'local';

const refresh = async (job, state, allowBuild) => {
  if (state === 'sources-edited') {
    if (!allowBuild) return 'kept';
    job.log('The addon C++ changed since its last build; rebuilding it.');
    return fallback(job, true);
  }
  job.log(`Preparing addon v${job.pins.addonVersion} (SDL ${job.pins.sdl3Version}, libusb ${job.pins.libusbVersion}) for ${job.paths.platformArch}.`);
  if (await installPrebuilt(job) === 'installed') return 'installed';
  return fallback(job, allowBuild);
};

/**
 * @param {import('./index.d.mts').EnsureAddonRequest} request
 * @returns {Promise<import('./index.d.mts').EnsureResult>}
 */
const ensureAddon = async ({ packageDir, mode, env, log }) => {
  const paths = addonPathsOf(packageDir);
  const job = { paths, pins: readPins(paths.nativeDir), force: mode === 'force', log };
  if (mode === 'force') return forceBuild(job);
  if (mode === 'postinstall' && (env.CI || hasLocalBuild(paths))) return 'skipped';
  const state = readAddonState(paths, job.pins);
  if (state === 'current') return 'current';
  return refresh(job, state, mode === 'prepare');
};

export { ensureAddon };
