/* @layer electron-main @kind logic */
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { currentVersion } from './current-version';
import { errorMessage } from './error-message';
import { listVersions } from './list-versions';
import { updaterCapabilities } from './updater-capabilities';

const refreshVersions = async (rt: UpdaterRuntime): Promise<VersionCandidate[]> => {
  const { ctx, feed, state } = rt;
  if (!feed || !updaterCapabilities(rt).canInstall) {
    state.versions = [];
    return state.versions;
  }
  try {
    state.versions = await listVersions(feed, currentVersion(rt), state.prefs.allowPrerelease);
  } catch (err) {
    ctx.log(`updater: the version list could not be read: ${errorMessage(err)}`, 'warn');
    state.versions = [];
  }
  return state.versions;
};

export { refreshVersions };
