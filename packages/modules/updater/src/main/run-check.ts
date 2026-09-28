/* @layer electron-main @kind logic */
import type { UpdateManager } from 'velopack';
import type { UpdateInfo } from '../updater.type';
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { compareVersions } from './compare-versions';
import { currentVersion } from './current-version';
import { errorMessage } from './error-message';
import { findNewerRelease } from './find-newer-release';
import { refreshVersions } from './refresh-versions';
import { updaterCapabilities } from './updater-capabilities';

const infoOf = ({ version, releaseNotes, releaseDate }: VersionCandidate): UpdateInfo => ({ version, releaseNotes, releaseDate });

const checkWithManager = async (rt: UpdaterRuntime, manager: UpdateManager): Promise<UpdateInfo | null> => {
  const found = await manager.checkForUpdatesAsync();
  const target = found?.TargetFullRelease;
  if (!target || compareVersions(target.Version, currentVersion(rt)) <= 0) return null;
  const listed = (await refreshVersions(rt)).find((v) => v.version === target.Version);
  return listed ? infoOf(listed) : { version: target.Version, releaseNotes: target.NotesMarkdown, releaseDate: '' };
};

const findUpdate = (rt: UpdaterRuntime): Promise<UpdateInfo | null> => {
  const manager = rt.manager();
  if (manager) return checkWithManager(rt, manager);
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
