/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import { createDocumentAccess } from '../src/main/documents/document-access';
import { documentHandlers } from '../src/main/documents/ipc-handlers';

const picker = vi.hoisted(() => ({
  open: vi.fn<(win: unknown, options: unknown) => Promise<{ canceled: boolean; filePaths: string[] }>>(),
  save: vi.fn<(win: unknown, options: unknown) => Promise<{ canceled: boolean; filePath?: string }>>(),
}));

vi.mock('electron', () => ({ dialog: { showOpenDialog: picker.open, showSaveDialog: picker.save } }));

type Handler = (event: unknown, ...args: unknown[]) => unknown;

let dir = '';
let access = createDocumentAccess();
let call: (channel: string, ...args: unknown[]) => Promise<unknown>;

const bytes = (...values: number[]): ArrayBuffer => new Uint8Array(values).buffer;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brock-documents-'));
  access = createDocumentAccess();
  const handlers = new Map<string, Handler>();
  const handle = ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'];
  documentHandlers.register({ handle, documents: access, window: () => ({}) } as Partial<MainContext> as MainContext);
  call = (channel, ...args) => Promise.resolve().then(() => handlers.get(channel)?.({}, ...args));
  picker.open.mockReset();
  picker.save.mockReset();
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('the document path rule', () => {
  it('refuses every path the user did not pick and the app did not allow', async () => {
    const mine = join(dir, 'mine.bxel');
    await writeFile(mine, 'secret');
    await expect(call('document:read', mine)).rejects.toThrow(/pick it in a document dialog first/);
    await expect(call('document:readText', mine)).rejects.toThrow(/may not use/);
    await expect(call('document:write', mine, bytes(1))).rejects.toThrow(/may not use/);
    await expect(call('document:writeText', mine, 'x')).rejects.toThrow(/may not use/);
    expect(await readFile(mine, 'utf8')).toBe('secret');
  });

  it('allows the exact file an open dialog returned, and no neighbour', async () => {
    const picked = join(dir, 'a.bxel');
    await writeFile(picked, 'doc a');
    await writeFile(join(dir, 'b.bxel'), 'doc b');
    picker.open.mockResolvedValue({ canceled: false, filePaths: [picked] });
    expect(await call('document:open', { title: 'Open', filters: [{ name: 'Bxel', extensions: ['.bxel'] }] })).toBe(picked);
    expect(await call('document:readText', picked)).toBe('doc a');
    expect([...new Uint8Array(await call('document:read', picked) as ArrayBuffer)]).toEqual([...Buffer.from('doc a')]);
    await expect(call('document:readText', join(dir, 'b.bxel'))).rejects.toThrow(/may not use/);
    await expect(call('document:readText', join(dir, 'x', '..', 'b.bxel'))).rejects.toThrow(/may not use/);
  });

  it('passes the options to the dialog as a hint and grants nothing for a default path', async () => {
    const hinted = join(dir, 'hint.bxel');
    picker.open.mockResolvedValue({ canceled: true, filePaths: [] });
    await call('document:open', { title: 'Open', defaultPath: hinted, filters: [{ name: 'Bxel', extensions: ['.bxel', '*.png'] }, { name: 'Bad', extensions: [] }] });
    expect(picker.open.mock.calls[0]?.[1]).toMatchObject({ title: 'Open', defaultPath: hinted, filters: [{ name: 'Bxel', extensions: ['bxel', 'png'] }], properties: ['openFile'] });
    expect(access.isAllowed(hinted)).toBe(false);
  });

  it('returns null on a cancelled dialog and allows nothing', async () => {
    picker.open.mockResolvedValue({ canceled: true, filePaths: [join(dir, 'a.bxel')] });
    picker.save.mockResolvedValue({ canceled: true });
    expect(await call('document:open')).toBeNull();
    expect(await call('document:saveAs')).toBeNull();
    expect(access.isAllowed(join(dir, 'a.bxel'))).toBe(false);
  });

});

describe('the document path rule for new files and app allowances', () => {
  it('lets a Save As path be written even though it did not exist yet', async () => {
    const target = join(dir, 'new.bxel');
    picker.save.mockResolvedValue({ canceled: false, filePath: target });
    expect(await call('document:saveAs', { defaultPath: 'sprite.bxel' })).toBe(target);
    await call('document:write', target, bytes(9, 8, 7));
    expect([...(await readFile(target))]).toEqual([9, 8, 7]);
    await call('document:writeText', target, 'text now');
    expect(await readFile(target, 'utf8')).toBe('text now');
    expect(await readdir(dir)).toEqual(['new.bxel']);
  });

  it('allows a path the app lists in main and ignores renderer-shaped lies', async () => {
    const listed = join(dir, 'listed.bxel');
    access.allow(listed);
    await call('document:writeText', listed, 'from the renderer');
    expect(await readFile(listed, 'utf8')).toBe('from the renderer');
    await expect(call('document:readText', 'listed.bxel')).rejects.toThrow(/absolute path/);
    await expect(call('document:readText', '')).rejects.toThrow(/absolute path/);
    await expect(call('document:readText', `${listed}\0.txt`)).rejects.toThrow(/absolute path/);
    await expect(call('document:readText', 42)).rejects.toThrow(/absolute path/);
    await expect(call('document:write', listed, 'not bytes')).rejects.toThrow(/needs bytes/);
    await expect(call('document:writeText', listed, bytes(1))).rejects.toThrow(/needs a string/);
  });

  it('matches paths without caring for dot segments, and for case on Windows only', () => {
    const file = join(dir, 'case.bxel');
    access.allow(file);
    expect(access.isAllowed(join(dir, '.', 'sub', '..', 'case.bxel'))).toBe(true);
    expect(access.isAllowed(file.toUpperCase())).toBe(process.platform === 'win32');
  });
});
