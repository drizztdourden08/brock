/* @layer electron-main @kind logic */
import type { InstalledRecord } from '../catalog.type';
import type { InstallDeps } from './install-item.type';

const retireRecord = async (deps: InstallDeps, previous: InstalledRecord, replacement: string | null): Promise<number> => {
  const released = (await deps.config.onRelease?.(previous, replacement, deps.ctx)) ?? 0;
  await deps.config.installers[previous.container]?.uninstall(previous, deps.ctx.files);
  return released;
};

export { retireRecord };
