/* @layer electron-main @kind logic */
import type { InstalledRecord } from '../catalog.type';
import type { InstallDeps } from './install-item.type';
import { trashingFiles } from './trashing-files';

const retireRecord = async (deps: InstallDeps, previous: InstalledRecord, replacement: string | null): Promise<number> => {
  const released = (await deps.config.onRelease?.(previous, replacement, deps.ctx)) ?? 0;
  const files = deps.config.removeTo === 'delete' ? deps.ctx.files : trashingFiles(deps.ctx.files);
  await deps.config.installers[previous.container]?.uninstall(previous, files);
  return released;
};

export { retireRecord };
