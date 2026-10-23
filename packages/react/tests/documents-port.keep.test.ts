/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { createElectronFactory } from '../src/platform/hosts/electron-factory';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { useProfilesStore } from '../src/stores/useProfilesStore';

const FILE = 'C:\\art\\a.bxel';
const PROFILE = { id: 'p1', name: 'Mira', created: 1, lastPlayed: 1 };

const stubApi = () => {
  const api = {
    os: 'win32',
    isDev: false,
    documentOpen: vi.fn((_opts?: unknown, _profileId?: string) => Promise.resolve(FILE)),
    documentSaveAs: vi.fn(() => Promise.resolve(null)),
    documentRead: vi.fn(() => Promise.resolve(new Uint8Array([4, 5]).buffer)),
    documentReadText: vi.fn(() => Promise.resolve('text')),
    documentWrite: vi.fn((_path: string, _data: ArrayBuffer, _profileId?: string) => Promise.resolve()),
    documentWriteText: vi.fn((_path: string, _text: string, _profileId?: string) => Promise.resolve()),
    documentRecent: vi.fn((_profileId: string) => Promise.resolve([{ path: FILE, name: 'a.bxel', lastOpened: 1 }])),
    documentClearRecent: vi.fn((_profileId: string) => Promise.resolve()),
    documentOpenRecent: vi.fn((_profileId: string, _path: string) => Promise.resolve<string | null>(FILE)),
    documentSnapshot: vi.fn((_profileId: string, _snapshot: { key: string; data: ArrayBuffer; name?: string }) => Promise.resolve()),
    documentRecoverable: vi.fn((_profileId: string) => Promise.resolve([{ key: 'k', name: null, path: null, savedAt: 1, size: 2 }])),
    documentRestoreSnapshot: vi.fn((_profileId: string, _key: string) => Promise.resolve<ArrayBuffer | null>(new Uint8Array([8, 9]).buffer)),
    documentDiscardSnapshot: vi.fn((_profileId: string, _key: string) => Promise.resolve()),
  };
  vi.stubGlobal('window', { api });
  return api;
};

const electronDocuments = (): DocumentsPort => {
  const documents = createElectronFactory().ports.documents?.();
  if (!documents) throw new Error('the Electron host has no documents port');
  return documents;
};

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

  it('sends writes as bytes and text on Electron', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    await documents.write(FILE, new Uint8Array([1, 2]));
    expect([...new Uint8Array(api.documentWrite.mock.calls[0]?.[1] ?? new ArrayBuffer(0))]).toEqual([1, 2]);
    await documents.writeText(FILE, 'hello');
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'hello', undefined);
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
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'x', 'p1');
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
