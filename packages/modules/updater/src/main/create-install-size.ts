/* @layer electron-main @kind logic */
import type { InstallLocation, InstallSize, RunCommand } from './updater-main.type';
import { KIB } from './updater-main.constants';
import { measurePath } from './measure-path';
import { publishUninstallSize } from './publish-uninstall-size';

const createInstallSize = (location: InstallLocation | null, run: RunCommand, measure = measurePath): InstallSize => {
  let measured: Promise<number | null> | null = null;

  const size = (): Promise<number | null> => {
    measured ??= location ? measure(location.path).catch(() => null) : Promise.resolve(null);
    return measured;
  };

  return {
    measure: size,
    publish: async () => {
      if (!location?.uninstallKey) return;
      const bytes = await size();
      if (bytes) await publishUninstallSize(run, location.uninstallKey, Math.ceil(bytes / KIB));
    },
  };
};

export { createInstallSize };
