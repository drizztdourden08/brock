/* @layer electron-main @kind logic */
import type { UpdateInfo } from '../updater.type';
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { compareVersions } from './compare-versions';
import { currentVersion } from './current-version';
import { errorMessage } from './error-message';
import { findNewerRelease } from './find-newer-release';
import { loadVersions } from './load-versions';
import { updaterCapabilities } from './updater-capabilities';

const infoOf = ({ version, releaseNotes, releaseDate, release }: VersionCandidate): UpdateInfo => ({ version, releaseNotes, releaseDate, release });

const newestListed = async (rt: UpdaterRuntime): Promise<UpdateInfo | null> => {
  const current = currentVersion(rt);
  const listed = (await loadVersions(rt)).find((v) => compareVersions(v.version, current) > 0);
  return listed ? infoOf(listed) : null;
};

const findUpdate = (rt: UpdaterRuntime): Promise<UpdateInfo | null> => {
  if (rt.manager()) return newestListed(rt);
  if (!rt.feed) return Promise.resolve(null);
  return findNewerRelease(rt.feed, currentVersion(rt), rt.state.prefs.allowPrerelease);
};

const runCheck = async (rt: UpdaterRuntime): Promise<UpdateInfo | null> => {
  const { ctx, state } = rt;
  if (!updaterCapabilities(rt).canCheck) return null;
  try {
    state.available = await findUpdate(rt);
    if (state.available) ctx.emit('updater:updateAvailable', state.available);
    else ctx.emit('updater:upToDate');
    return state.available;
  } catch (err) {
    ctx.emit('updater:error', errorMessage(err));
    return null;
  }
};

export { runCheck };
