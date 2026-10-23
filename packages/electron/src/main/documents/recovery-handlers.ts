/* @layer electron-main @kind logic */
import { toArrayBuffer } from '../files/to-array-buffer';
import type { MainContext } from '../types/main-context.type';
import type { DocumentTracking } from './document-tracking.type';
import { profileIdOf } from './profile-id-of';
import { snapshotOf } from './snapshot-of';

const registerRecoveryHandlers = ({ handle }: Pick<MainContext, 'handle'>, { recovery }: DocumentTracking): void => {
  handle('document:snapshot', (_event, profileId, snapshot) => {
    const { key, data, meta } = snapshotOf(snapshot);
    return recovery.save(profileIdOf(profileId), key, data, meta);
  });
  handle('document:recoverable', (_event, profileId) => recovery.list(profileIdOf(profileId)));
  handle('document:restoreSnapshot', async (_event, profileId, key) => {
    const bytes = await recovery.read(profileIdOf(profileId), key);
    return bytes === null ? null : toArrayBuffer(bytes);
  });
  handle('document:discardSnapshot', (_event, profileId, key) => recovery.discard(profileIdOf(profileId), key));
};

export { registerRecoveryHandlers };
