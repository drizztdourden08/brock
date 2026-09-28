/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { UpdateInfo as VelopackUpdateInfo } from 'velopack';
import type { UpdaterRuntime } from './updater-main.type';
import type { VersionCandidate } from './update-plan.type';
import { errorMessage } from './error-message';
import { refreshVersions } from './refresh-versions';

const asVelopackUpdate = ({ plan, downgrade }: VersionCandidate): VelopackUpdateInfo => ({
  TargetFullRelease: plan.target,
  BaseRelease: plan.base,
  DeltasToTarget: plan.deltas,
  IsDowngrade: downgrade,
});

const pickCandidate = async (rt: UpdaterRuntime, version: string | null): Promise<VersionCandidate> => {
  const list = rt.state.versions.length > 0 ? rt.state.versions : await refreshVersions(rt);
  const option = version ? list.find((v) => v.version === version) : list[0];
  if (option) return option;
  throw new Error(version ? `Version ${version} is not in the release feed` : 'The release feed listed no installable version');
};

const applyVersion = async (rt: UpdaterRuntime, version: string | null): Promise<void> => {
  const { ctx } = rt;
  try {
    const manager = rt.manager();
    if (!manager) throw new Error('This build cannot install updates itself');
    const update = asVelopackUpdate(await pickCandidate(rt, version));
    await manager.downloadUpdateAsync(update, (percent) => ctx.emit('updater:downloadProgress', { percent }));
    ctx.emit('updater:downloadComplete');
    manager.waitExitThenApplyUpdate(update, true, true);
    app.quit();
  } catch (err) {
    ctx.emit('updater:error', errorMessage(err));
  }
};

export { applyVersion };
