/* @layer electron-main @kind logic */
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { currentVersion } from './current-version';
import { listVersions } from './list-versions';
import { updaterCapabilities } from './updater-capabilities';

const loadVersions = async (rt: UpdaterRuntime): Promise<VersionCandidate[]> => {
  const { feed, state } = rt;
  state.versions = feed && updaterCapabilities(rt).canInstall
    ? await listVersions(feed, currentVersion(rt), state.prefs.allowPrerelease)
    : [];
  return state.versions;
};

export { loadVersions };
