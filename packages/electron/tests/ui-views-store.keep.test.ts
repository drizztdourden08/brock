/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { createUiViewsStore } from '../src/main/handlers/ui-views-store';

const memoryFiles = (initial: Record<string, string>) => {
  const texts = new Map(Object.entries(initial));
  const files: Pick<FileStore, 'readText' | 'writeText'> = {
    readText: (path: string) => new Promise<string | null>((resolve) => { setTimeout(() => resolve(texts.get(path) ?? null), 1); }),
    writeText: (path: string, data: string) => new Promise<void>((resolve) => { setTimeout(() => { texts.set(path, data); resolve(); }, 2); }),
  };
  return { files, read: () => JSON.parse(texts.get('ui-views.json') ?? '{}') as Record<string, unknown> };
};

describe('the ui-views file in main', () => {
  it('merges each patch into the file on disk, one after another, and removes a key patched to null', async () => {
    const disk = memoryFiles({ 'ui-views.json': JSON.stringify({ 'profile:p1': { a: 1 }, 'app:editor': { zoom: 2 } }) });
    const views = createUiViewsStore(disk.files as FileStore);
    await Promise.all([
      views.patch({ 'profile:p1': { a: 2 } }),
      views.patch({ 'app:panel': { open: true } }),
      views.patch({ 'app:editor': null }),
    ]);
    expect(disk.read()).toEqual({ 'profile:p1': { a: 2 }, 'app:panel': { open: true } });
    expect(await views.load()).toEqual({ 'profile:p1': { a: 2 }, 'app:panel': { open: true } });
  });

  it('reads a missing or broken file as empty', async () => {
    expect(await createUiViewsStore(memoryFiles({}).files).load()).toEqual({});
    expect(await createUiViewsStore(memoryFiles({ 'ui-views.json': '[1, 2]' }).files).load()).toEqual({});
  });
});
