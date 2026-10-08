/* @layer electron-main @kind logic */
import { assertItemId } from './assert-item-id';
import type { InstallDeps } from './install-item.type';
import { isInstalling } from './is-installing';
import { retireRecord } from './retire-record';

const uninstallItem = async (deps: InstallDeps, itemId: string): Promise<number> => {
  assertItemId(itemId);
  if (isInstalling(deps.ctx, itemId)) throw new Error('Wait for the install to finish first.');
  const record = await deps.registry.get(itemId);
  if (!record) return 0;
  const released = await retireRecord(deps, record, null);
  await deps.registry.remove(itemId);
  await deps.config.onUninstalled?.(record, deps.ctx);
  return released;
};

export { uninstallItem };
