/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { electronDocuments, FILE, PROFILE, stubApi } from './documents-port-fixture';

afterEach(() => {
  vi.unstubAllGlobals();
  useProfilesStore.setState({ active: null });
});

describe('the documents port', () => {
  it('maps the dialogs and reads onto the document channels on Electron', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    expect(await documents.open({ title: 'Open' })).toBe(FILE);
    expect(api.documentOpen).toHaveBeenCalledWith({ title: 'Open' }, undefined);
    expect(await documents.saveAs()).toBeNull();
    expect([...(await documents.read(FILE))]).toEqual([4, 5]);
    expect(await documents.readText(FILE)).toBe('text');
  });

  it('maps the folder dialog and the listing onto their channels', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    expect(await documents.openFolder({ title: 'Project' })).toBe('C:\\art');
    expect(api.documentOpenFolder).toHaveBeenCalledWith({ title: 'Project' }, undefined);
    expect((await documents.list('C:\\art', { extensions: ['bxel'], recursive: true })).entries.map((entry) => entry.name)).toEqual(['a.bxel']);
    expect(api.documentList).toHaveBeenCalledWith('C:\\art', { extensions: ['bxel'], recursive: true });
  });

  it('sends writes as bytes and text on Electron', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    await documents.write(FILE, new Uint8Array([1, 2]));
    expect([...new Uint8Array(api.documentWrite.mock.calls[0]?.[1] ?? new ArrayBuffer(0))]).toEqual([1, 2]);
    await documents.writeText(FILE, 'hello');
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'hello', undefined, undefined);
  });

  it('passes the write options on, and leaves them out by default', async () => {
    const api = stubApi();
    useProfilesStore.setState({ active: PROFILE });
    const documents = electronDocuments();
    await documents.write(FILE, new Uint8Array([1]), { recent: false });
    await documents.writeText(FILE, 'png', { recent: false });
    expect(api.documentWrite.mock.calls[0]?.[3]).toEqual({ recent: false });
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'png', 'p1', { recent: false });
    await documents.writeText(FILE, 'doc');
    expect(api.documentWriteText).toHaveBeenLastCalledWith(FILE, 'doc', 'p1', undefined);
  });

  it('is absent on the web host', () => {
    expect(createWebFactory().ports.documents).toBeUndefined();
  });
});

describe('recent documents and recovery on Electron', () => {
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
