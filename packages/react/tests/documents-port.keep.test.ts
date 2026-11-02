/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { electronDocuments, FILE, PROFILE, stubApi } from './documents-port-fixture';

afterEach(() => {
  vi.unstubAllGlobals();
  useProfilesStore.setState({ active: null });
});

describe('S2 the documents port', { tags: ['standard'] }, () => {
  it('sends writes as bytes and text on Electron', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    await documents.write(FILE, new Uint8Array([1, 2]));
    expect([...new Uint8Array(api.documentWrite.mock.calls[0]?.[1] ?? new ArrayBuffer(0))]).toEqual([1, 2]);
    await documents.writeText(FILE, 'hello');
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'hello', undefined, undefined);
  });
});

describe('S2 the write check on Electron', { tags: ['standard'] }, () => {
  it('sends a folder to the dry run and returns its answer', async () => {
    const api = stubApi();
    expect(await electronDocuments().canWrite?.('C:\\art')).toEqual({ ok: true, path: 'C:\\art' });
    expect(api.documentCanWrite).toHaveBeenCalledWith('C:\\art');
  });
});

describe('S2 recent documents and recovery on Electron', { tags: ['standard'] }, () => {
  it('passes the active profile to every channel', async () => {
    const api = stubApi();
    useProfilesStore.setState({ active: PROFILE });
    const documents = electronDocuments();
    await documents.open();
    await documents.write(FILE, new Uint8Array([1]));
    await documents.writeText(FILE, 'x');
    expect(api.documentOpen).toHaveBeenCalledWith(undefined, 'p1');
    expect(api.documentWrite.mock.calls[0]?.[2]).toBe('p1');
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'x', 'p1', undefined);
    expect(await documents.recent()).toEqual([{ path: FILE, name: 'a.bxel', lastOpened: 1 }]);
    expect(await documents.openRecent(FILE)).toBe(FILE);
    await documents.clearRecent();
    expect(api.documentRecent).toHaveBeenCalledWith('p1');
    expect(api.documentOpenRecent).toHaveBeenCalledWith('p1', FILE);
    expect(api.documentClearRecent).toHaveBeenCalledWith('p1');
  });

  it('sends snapshots as bytes and reads them back as bytes', async () => {
    const api = stubApi();
    useProfilesStore.setState({ active: PROFILE });
    const documents = electronDocuments();
    await documents.snapshot('k', new Uint8Array([3, 4]), { name: 'sprite' });
    const call = api.documentSnapshot.mock.calls[0];
    expect(call?.[0]).toBe('p1');
    expect(call?.[1]).toMatchObject({ key: 'k', name: 'sprite' });
    expect([...new Uint8Array(call?.[1].data ?? new ArrayBuffer(0))]).toEqual([3, 4]);
    expect(await documents.recoverable()).toEqual([{ key: 'k', name: null, path: null, savedAt: 1, size: 2 }]);
    expect([...(await documents.restoreSnapshot('k') ?? [])]).toEqual([8, 9]);
    api.documentRestoreSnapshot.mockResolvedValue(null);
    expect(await documents.restoreSnapshot('k')).toBeNull();
    await documents.discardSnapshot('k');
    expect(api.documentDiscardSnapshot).toHaveBeenCalledWith('p1', 'k');
  });

  it('answers empty with no profile, and refuses a snapshot', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    expect(await documents.recent()).toEqual([]);
    expect(await documents.recoverable()).toEqual([]);
    expect(await documents.openRecent(FILE)).toBeNull();
    expect(await documents.restoreSnapshot('k')).toBeNull();
    await documents.clearRecent();
    await documents.discardSnapshot('k');
    await expect(documents.snapshot('k', new Uint8Array([1]))).rejects.toThrow(/active profile/);
    expect(api.documentRecent).not.toHaveBeenCalled();
    expect(api.documentSnapshot).not.toHaveBeenCalled();
  });
});

describe('S2 watching a folder on Electron', { tags: ['standard'] }, () => {
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

describe('S2 remembered folders on Electron', { tags: ['standard'] }, () => {
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
