/* @layer electron-main @kind logic */
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { errorMessage } from './error-message';
import { loadVersions } from './load-versions';

const refreshVersions = async (rt: UpdaterRuntime): Promise<VersionCandidate[]> => {
  try {
    return await loadVersions(rt);
  } catch (err) {
    rt.ctx.log(`updater: the version list could not be read: ${errorMessage(err)}`, 'warn');
    rt.state.versions = [];
    return rt.state.versions;
  }
};

export { refreshVersions };
