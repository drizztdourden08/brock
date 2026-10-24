/* @layer renderer-shell @kind test */
import { vi } from 'vitest';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { createElectronFactory } from '../src/platform/hosts/electron-factory';

const FILE = 'C:\\art\\a.bxel';
const PROFILE = { id: 'p1', name: 'Mira', created: 1, lastPlayed: 1 };

const stubApi = () => {
  const watchers: ((id: string, event: unknown) => void)[] = [];
  const api = {
    os: 'win32',
    isDev: false,
    documentOpen: vi.fn((_opts?: unknown, _profileId?: string) => Promise.resolve(FILE)),
    documentSaveAs: vi.fn(() => Promise.resolve(null)),
    documentOpenFolder: vi.fn((_opts?: unknown) => Promise.resolve<string | null>('C:\\art')),
    documentList: vi.fn((_folder: string, _options?: unknown) => Promise.resolve({ entries: [{ path: FILE, name: 'a.bxel', kind: 'file', size: 2, modified: 3, link: false }], truncated: false })),
    documentRevokeFolder: vi.fn((_path: string) => Promise.resolve(true)),
    documentTrash: vi.fn((_path: string) => Promise.resolve()),
    documentRename: vi.fn((_from: string, _to: string, _options?: unknown) => Promise.resolve()),
    documentMkdir: vi.fn((_path: string, _options?: unknown) => Promise.resolve()),
    documentWatch: vi.fn((_id: string, _folder: string, _options: unknown) => Promise.resolve()),
    documentUnwatch: vi.fn((_id: string) => Promise.resolve()),
    onDocumentWatch: vi.fn((callback: (id: string, event: unknown) => void) => {
      watchers.push(callback);
      return () => watchers.splice(watchers.indexOf(callback), 1);
    }),
    documentRememberedFolders: vi.fn((_profileId: string) => Promise.resolve([{ path: 'C:\\art', name: 'art', lastOpened: 1, available: true }])),
    documentRegrant: vi.fn((_profileId: string, path: string) => Promise.resolve(path)),
    documentForgetFolder: vi.fn((_profileId: string, _path: string) => Promise.resolve(true)),
    documentRead: vi.fn(() => Promise.resolve(new Uint8Array([4, 5]).buffer)),
    documentReadText: vi.fn(() => Promise.resolve('text')),
    documentWrite: vi.fn((_path: string, _data: ArrayBuffer, _profileId?: string, _options?: unknown) => Promise.resolve()),
    documentWriteText: vi.fn((_path: string, _text: string, _profileId?: string, _options?: unknown) => Promise.resolve()),
    documentRecent: vi.fn((_profileId: string) => Promise.resolve([{ path: FILE, name: 'a.bxel', lastOpened: 1 }])),
    documentClearRecent: vi.fn((_profileId: string) => Promise.resolve()),
    documentOpenRecent: vi.fn((_profileId: string, _path: string) => Promise.resolve<string | null>(FILE)),
    documentSnapshot: vi.fn((_profileId: string, _snapshot: { key: string; data: ArrayBuffer; name?: string }) => Promise.resolve()),
    documentRecoverable: vi.fn((_profileId: string) => Promise.resolve([{ key: 'k', name: null, path: null, savedAt: 1, size: 2 }])),
    documentRestoreSnapshot: vi.fn((_profileId: string, _key: string) => Promise.resolve<ArrayBuffer | null>(new Uint8Array([8, 9]).buffer)),
    documentDiscardSnapshot: vi.fn((_profileId: string, _key: string) => Promise.resolve()),
  };
  vi.stubGlobal('window', { api });
  return Object.assign(api, { watchers });
};

const electronDocuments = (): DocumentsPort => {
  const documents = createElectronFactory().ports.documents?.();
  if (!documents) throw new Error('the Electron host has no documents port');
  return documents;
};

export { electronDocuments, FILE, PROFILE, stubApi };
