/* @layer renderer-shell @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { activeProfileId } from './active-profile-id';
import { NO_PROFILE } from './electron-documents.constants';
import { toArrayBuffer } from './to-array-buffer';

const createElectronDocuments = (): DocumentsPort => {
  const api = requireHostApi();
  const withProfile = <T>(none: T, call: (profileId: string) => Promise<T>): Promise<T> => {
    const profileId = activeProfileId();
    return profileId === null ? Promise.resolve(none) : call(profileId);
  };
  const needProfile = <T>(call: (profileId: string) => Promise<T>): Promise<T> => {
    const profileId = activeProfileId();
    return profileId === null ? Promise.reject(new Error(NO_PROFILE)) : call(profileId);
  };
  return {
    open: (opts) => api.documentOpen(opts, activeProfileId() ?? undefined),
    saveAs: (opts) => api.documentSaveAs(opts),
    read: async (path) => new Uint8Array(await api.documentRead(path)),
    readText: (path) => api.documentReadText(path),
    write: (path, data, options) => api.documentWrite(path, toArrayBuffer(data), activeProfileId() ?? undefined, options),
    writeText: (path, text, options) => api.documentWriteText(path, text, activeProfileId() ?? undefined, options),
    recent: () => withProfile([], (profileId) => api.documentRecent(profileId)),
    clearRecent: () => withProfile<void>(undefined, (profileId) => api.documentClearRecent(profileId)),
    openRecent: (path) => withProfile(null, (profileId) => api.documentOpenRecent(profileId, path)),
    snapshot: (key, data, meta) => needProfile((profileId) => api.documentSnapshot(profileId, { ...meta, key, data: toArrayBuffer(data) })),
    recoverable: () => withProfile([], (profileId) => api.documentRecoverable(profileId)),
    restoreSnapshot: (key) => withProfile(null, async (profileId) => {
      const bytes = await api.documentRestoreSnapshot(profileId, key);
      return bytes === null ? null : new Uint8Array(bytes);
    }),
    discardSnapshot: (key) => withProfile<void>(undefined, (profileId) => api.documentDiscardSnapshot(profileId, key)),
  };
};

export { createElectronDocuments };
