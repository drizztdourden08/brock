/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { createElectronFactory } from '../src/platform/hosts/electron-factory';
import { createWebFactory } from '../src/platform/hosts/web-factory';

const FILE = 'C:\\art\\a.bxel';

const stubApi = () => {
  const api = {
    os: 'win32',
    isDev: false,
    documentOpen: vi.fn((_opts?: unknown) => Promise.resolve(FILE)),
    documentSaveAs: vi.fn(() => Promise.resolve(null)),
    documentRead: vi.fn(() => Promise.resolve(new Uint8Array([4, 5]).buffer)),
    documentReadText: vi.fn(() => Promise.resolve('text')),
    documentWrite: vi.fn((_path: string, _data: ArrayBuffer) => Promise.resolve()),
    documentWriteText: vi.fn((_path: string, _text: string) => Promise.resolve()),
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
});

describe('the documents port', () => {
  it('maps the dialogs and reads onto the document channels on Electron', async () => {
    const api = stubApi();
    const documents = electronDocuments();
    expect(await documents.open({ title: 'Open' })).toBe(FILE);
    expect(api.documentOpen).toHaveBeenCalledWith({ title: 'Open' });
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
    expect(api.documentWriteText).toHaveBeenCalledWith(FILE, 'hello');
  });

  it('is absent on the web host', () => {
    expect(createWebFactory().ports.documents).toBeUndefined();
  });
});
