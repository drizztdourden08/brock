/* @layer electron-main @kind logic */
import { VelopackApp } from 'velopack';
import type { VelopackHooks } from './updater-main.type';

const runVelopackHooks = (hooks: VelopackHooks): void => {
  const { afterInstall, afterUpdate, beforeUpdate, beforeUninstall, firstRun, restarted } = hooks;
  let velopack = VelopackApp.build();
  if (afterInstall) velopack = velopack.onAfterInstallFastCallback(afterInstall);
  if (afterUpdate) velopack = velopack.onAfterUpdateFastCallback(afterUpdate);
  if (beforeUpdate) velopack = velopack.onBeforeUpdateFastCallback(beforeUpdate);
  if (beforeUninstall) velopack = velopack.onBeforeUninstallFastCallback(beforeUninstall);
  if (firstRun) velopack = velopack.onFirstRun(firstRun);
  if (restarted) velopack = velopack.onRestarted(restarted);
  velopack.run();
};

export { runVelopackHooks };
