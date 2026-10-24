/* @layer electron-main @kind logic */
import { toArrayBuffer } from '../files/to-array-buffer';
import type { MainContext } from '../types/main-context.type';
import type { DocumentTracking } from './document-tracking.type';
import { snapshotOf } from './snapshot-of';

const registerRecoveryHandlers = ({ handle }: Pick<MainContext, 'handle'>, { recovery, profile }: DocumentTracking): void => {
  handle('document:snapshot', async (_event, profileId, snapshot) => {
    const { key, data, meta } = snapshotOf(snapshot);
    return recovery.save(await profile(profileId), key, data, meta);
  });
  handle('document:recoverable', async (_event, profileId) => recovery.list(await profile(profileId)));
  handle('document:restoreSnapshot', async (_event, profileId, key) => {
    const bytes = await recovery.read(await profile(profileId), key);
    return bytes === null ? null : toArrayBuffer(bytes);
  });
  handle('document:discardSnapshot', async (_event, profileId, key) => recovery.discard(await profile(profileId), key));
};

export { registerRecoveryHandlers };
