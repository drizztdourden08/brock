/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';

const FILE = (name: string) => ({ name }) as File;

const setup = async (paths: Record<string, string | null>, vet?: (paths: string[]) => Promise<unknown>) => {
  vi.resetModules();
  vi.stubGlobal('window', { api: vet ? { documentVetDrop: vet } : {} });
  vi.doMock('../src/platform/get-platform', () => ({ getPlatform: () => ({ filePicker: { pathOf: (file: File) => paths[file.name] ?? null } }) }));
  return (await import('../src/dnd/resolve-dropped-files')).resolveDroppedFiles;
};

afterEach(() => {
  vi.doUnmock('../src/platform/get-platform');
  vi.unstubAllGlobals();
});

describe('OS file drops', () => {
  it('sends the paths to main and keeps only what main granted, under the path main answered', async () => {
    const vet = vi.fn((paths: string[]) => Promise.resolve([
      { path: `${paths[0]}.real`, kind: 'file', granted: true },
      { path: paths[1], kind: null, granted: false, reason: 'Inside AppData' },
    ]));
    const resolve = await setup({ 'a.png': 'C:\\art\\a.png', 'b.txt': 'C:\\AppData\\b.txt' }, vet);
    const dropped = await resolve([FILE('a.png'), FILE('b.txt')]);
    expect(vet).toHaveBeenCalledWith(['C:\\art\\a.png', 'C:\\AppData\\b.txt']);
    expect(dropped.files.map((f) => [f.name, f.path, f.kind])).toEqual([['a.png', 'C:\\art\\a.png.real', 'file']]);
    expect(dropped.rejected).toEqual([{ name: 'b.txt', reason: 'Inside AppData' }]);
  });

  it('never passes a renderer path on when main cannot vet it', async () => {
    const resolve = await setup({ 'a.png': 'C:\\art\\a.png' });
    const dropped = await resolve([FILE('a.png')]);
    expect(dropped.files).toEqual([expect.objectContaining({ name: 'a.png', path: null })]);
    expect(dropped.rejected).toEqual([]);
  });

  it('gives a file with no path (the web) as the File alone, and skips main when there is nothing to vet', async () => {
    const vet = vi.fn(() => Promise.resolve([]));
    const resolve = await setup({}, vet);
    const dropped = await resolve([FILE('a.png')]);
    expect(vet).not.toHaveBeenCalled();
    expect(dropped.files[0]?.path).toBeNull();
  });

  it('falls back to the bare File when the vet call fails', async () => {
    const resolve = await setup({ 'a.png': 'C:\\art\\a.png' }, () => Promise.reject(new Error('gone')));
    expect((await resolve([FILE('a.png')])).files[0]?.path).toBeNull();
  });
});
