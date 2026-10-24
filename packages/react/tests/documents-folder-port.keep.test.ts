/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { electronDocuments, FILE, PROFILE, stubApi } from './documents-port-fixture';

afterEach(() => {
  vi.unstubAllGlobals();
  useProfilesStore.setState({ active: null });
});

describe('the folder operations on Electron', () => {
  it('maps trash, rename, mkdir and revokeFolder onto their channels', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    await documents.trash(FILE);
    await documents.rename(FILE, 'C:\\art\\b.bxel', { overwrite: true });
    await documents.mkdir('C:\\art\\new', { recursive: true });
    expect(await documents.revokeFolder('C:\\art')).toBe(true);
    expect(api.documentTrash).toHaveBeenCalledWith(FILE);
    expect(api.documentRename).toHaveBeenCalledWith(FILE, 'C:\\art\\b.bxel', { overwrite: true });
    expect(api.documentMkdir).toHaveBeenCalledWith('C:\\art\\new', { recursive: true });
    expect(api.documentRevokeFolder).toHaveBeenCalledWith('C:\\art');
  });
});

describe('watching a folder on Electron', () => {
  it('sends the events of its own watch to the listener until it is unsubscribed', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    const first = vi.fn();
    const second = vi.fn();
    const stop = await documents.watch('C:\\art', { recursive: true }, first);
    await documents.watch('C:\\art', {}, second);
    const [firstId, secondId] = api.documentWatch.mock.calls.map(([id]) => id);
    expect(firstId).not.toBe(secondId);
    expect(api.documentWatch).toHaveBeenCalledWith(firstId, 'C:\\art', { recursive: true });
    for (const watcher of api.watchers) watcher(firstId ?? '', { kind: 'add', path: FILE });
    expect(first).toHaveBeenCalledWith({ kind: 'add', path: FILE });
    expect(second).not.toHaveBeenCalled();
    stop();
    stop();
    expect(api.documentUnwatch).toHaveBeenCalledTimes(1);
    expect(api.documentUnwatch).toHaveBeenCalledWith(firstId);
    expect(api.watchers).toHaveLength(1);
  });

  it('rejects and drops its event listener when main refuses the folder', async () => {
    const api = stubApi();
    api.documentWatch.mockRejectedValue(new Error('not inside a granted folder'));
    const listener = vi.fn();
    await expect(electronDocuments().watch('C:\\other', {}, listener)).rejects.toThrow(/granted folder/);
    expect(api.watchers).toHaveLength(0);
  });
});

describe('remembered folders on Electron', () => {
  it('lists, grants again and forgets with the active profile', async () => {
    const api = stubApi();
    useProfilesStore.setState({ active: PROFILE });
    const documents = electronDocuments();
    expect(await documents.rememberedFolders()).toEqual([{ path: 'C:\\art', name: 'art', lastOpened: 1, available: true }]);
    expect(await documents.regrant('C:\\art')).toBe('C:\\art');
    expect(await documents.forgetFolder('C:\\art')).toBe(true);
    await documents.openFolder();
    expect(api.documentRememberedFolders).toHaveBeenCalledWith('p1');
    expect(api.documentRegrant).toHaveBeenCalledWith('p1', 'C:\\art');
    expect(api.documentForgetFolder).toHaveBeenCalledWith('p1', 'C:\\art');
    expect(api.documentOpenFolder).toHaveBeenCalledWith(undefined, 'p1');
  });

  it('answers empty with no profile, and refuses to grant again', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    expect(await documents.rememberedFolders()).toEqual([]);
    expect(await documents.forgetFolder('C:\\art')).toBe(false);
    await expect(documents.regrant('C:\\art')).rejects.toThrow(/active profile/);
    expect(api.documentRegrant).not.toHaveBeenCalled();
  });
});
